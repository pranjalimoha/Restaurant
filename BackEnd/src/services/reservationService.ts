import prisma from "../lib/prisma.js";
import { $Enums } from "@prisma/client";
import type {
  CreateReservationRequest,
  ReservationServiceUserId,
  SearchAvailableTablesInput,
} from "../types.js";
import { isWeekend } from "../utils/dateHelpers.js";
import { normalizeTime } from "../utils/timeHelper.js";
import { getAvailableTablesForReservation } from "./tableService.js";
import { HttpError } from "../utils/httpError.js";

export const searchAvailableTables = async (
  searchData: SearchAvailableTablesInput,
) => {
  const { date, time, numberOfGuests } = searchData;

  const isHighTrafficDay = await checkIfHighTrafficDay(date);
  const normalizedTime = normalizeTime(time);

  const result = await getAvailableTablesForReservation(
    date,
    normalizedTime,
    numberOfGuests,
  );

  return {
    ...result,
    requiresHoldingFee: isHighTrafficDay,
    holdingFeeAmount: isHighTrafficDay ? 10.0 : 0,
  };
};

export const getAllReservations = async () => {
  return prisma.reservations.findMany({
    include: {
      reservation_tables: {
        include: {
          restaurant_tables: true,
        },
      },
      users: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
    orderBy: [{ reservation_date: "asc" }, { reservation_time: "asc" }],
  });
};

export const authorizeHoldingFee = async (reservationId: string) => {
  const reservation = await prisma.reservations.findUnique({
    where: { id: reservationId },
  });

  if (!reservation) {
    throw new HttpError("Reservation not found", 404);
  }

  if (!reservation.requires_holding_fee) {
    throw new HttpError("This reservation does not require a holding fee", 400);
  }

  if (reservation.status !== "PENDING") {
    throw new HttpError(
      `Only PENDING reservations can be confirmed. Current status: ${reservation.status}`,
      400,
    );
  }

  return prisma.reservations.update({
    where: { id: reservationId },
    data: {
      holding_fee_paid: true,
      status: "CONFIRMED",
    },
  });
};

async function checkIfHighTrafficDay(date: Date | string): Promise<boolean> {
  const d = new Date(date);

  const month = d.getMonth() + 1;
  const day = d.getDate();
  const weekday = d.getDay();
  const weekOfMonth = Math.ceil(day / 7);

  const specialDay = await prisma.special_days.findFirst({
    where: {
      is_active: true,
      OR: [
        { pattern_type: "fixed_annual", month, day },
        { pattern_type: "weekly", weekday },
        {
          pattern_type: "nth_weekday_annual",
          month,
          weekday,
          week_of_month: weekOfMonth,
        },
        {
          pattern_type: "exact_date",
          exact_date: d,
        },
      ],
    },
  });

  if (specialDay) return true;

  return isWeekend(d);
}

export const createReservation = async (
  reservationData: CreateReservationRequest,
  userId: ReservationServiceUserId = null,
) => {
  const {
    guestName,
    guestEmail,
    guestPhone,
    reservationDate,
    reservationTime,
    numberOfGuests,
    selectedTableIds,
    specialRequests,
  } = reservationData;

  if (!selectedTableIds || selectedTableIds.length === 0) {
    throw new HttpError("At least one table must be selected", 400);
  }

  const normalizedTime = normalizeTime(reservationTime);

  const [hour, minute] = normalizedTime.split(":").map(Number);

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    throw new HttpError("Invalid reservation time", 400);
  }

  const selectedMinutes = hour * 60 + minute;
  const openingMinutes = 10 * 60;
  const closingMinutes = 22 * 60;

  if (selectedMinutes < openingMinutes || selectedMinutes > closingMinutes) {
    throw new HttpError(
      "Reservations are only allowed between 10:00 AM and 10:00 PM",
      400,
    );
  }

  const reservationDateTime = new Date(
    `${reservationDate}T${normalizedTime}:00`,
  );

  if (Number.isNaN(reservationDateTime.getTime())) {
    throw new HttpError("Invalid reservation date or time", 400);
  }

  if (reservationDateTime.getTime() < Date.now()) {
    throw new HttpError(
      "Cannot create a reservation for a past date or time",
      400,
    );
  }

  const conflictingReservation = await prisma.reservations.findFirst({
    where: {
      reservation_date: new Date(reservationDate),
      reservation_time: new Date(`1970-01-01T${normalizedTime}:00`),
      status: {
        in: ["PENDING", "CONFIRMED"],
      },
      reservation_tables: {
        some: {
          table_id: {
            in: selectedTableIds,
          },
        },
      },
    },
  });

  if (conflictingReservation) {
    throw new HttpError(
      "One or more selected tables are already reserved for this date and time",
      409,
    );
  }

  const selectedTables = await prisma.restaurant_tables.findMany({
    where: {
      id: {
        in: selectedTableIds,
      },
      is_active: true,
    },
  });

  if (selectedTables.length !== selectedTableIds.length) {
    throw new HttpError(
      "One or more selected tables are not active or do not exist",
      400,
    );
  }

  const totalCapacity = selectedTables.reduce(
    (sum, table) => sum + table.capacity,
    0,
  );

  if (totalCapacity < numberOfGuests) {
    throw new HttpError("Selected tables do not have sufficient capacity", 400);
  }

  const needsCombination = selectedTableIds.length > 1;

  const isHighTrafficDay = await checkIfHighTrafficDay(reservationDate);
  const holdingFeeAmount = isHighTrafficDay ? 10.0 : 0;

  const finalUserId =
    userId && userId !== "undefined" && userId !== "null" ? userId : null;

  if (finalUserId) {
    const existingUser = await prisma.users.findUnique({
      where: {
        id: finalUserId,
      },
      select: {
        id: true,
      },
    });

    if (!existingUser) {
      throw new HttpError("Registered user not found", 404);
    }
  }

  const reservation = await prisma.reservations.create({
    data: {
      user_id: finalUserId,
      guest_name: guestName,
      guest_email: guestEmail,
      guest_phone: guestPhone,
      reservation_date: new Date(reservationDate),
      reservation_time: new Date(`1970-01-01T${normalizedTime}:00`),
      number_of_guests: numberOfGuests,
      requires_holding_fee: isHighTrafficDay,
      holding_fee_paid: false,
      holding_fee_amount: holdingFeeAmount,
      tables_need_combining: needsCombination,
      special_requests: specialRequests,
      status: isHighTrafficDay ? "PENDING" : "CONFIRMED",
      reservation_tables: {
        create: selectedTableIds.map((tableId) => ({
          table_id: tableId,
        })),
      },
    },
    include: {
      reservation_tables: {
        include: {
          restaurant_tables: true,
        },
      },
      users: {
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          preferred_diner_number: true,
        },
      },
    },
  });

  const combinationNote = needsCombination
    ? `Tables ${selectedTables
        .map((table) => table.table_number)
        .join(" + ")} combined for ${numberOfGuests} guests`
    : null;

  return {
    reservation,
    isGuestReservation: !reservation.user_id,
    requiresRegistration: !reservation.user_id,
    requiresHoldingFee: isHighTrafficDay,
    tablesCombined: needsCombination,
    combinationNote,
  };
};

export const getUserReservations = async (userId: string) => {
  return prisma.reservations.findMany({
    where: {
      user_id: userId,
    },
    include: {
      reservation_tables: {
        include: {
          restaurant_tables: true,
        },
      },
    },
    orderBy: {
      reservation_date: "desc",
    },
  });
};

export const getReservationById = async (reservationId: string) => {
  return prisma.reservations.findUnique({
    where: {
      id: reservationId,
    },
    include: {
      reservation_tables: {
        include: {
          restaurant_tables: true,
        },
      },
      users: {
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          preferred_diner_number: true,
          earned_points: true,
        },
      },
      transactions: true,
    },
  });
};

export const cancelReservation = async (
  reservationId: string,
  userId: string,
) => {
  const reservation = await prisma.reservations.findUnique({
    where: {
      id: reservationId,
    },
  });

  if (!reservation) {
    throw new HttpError("Reservation not found", 404);
  }

  if (reservation.user_id !== userId) {
    throw new HttpError(
      "You do not have permission to cancel this reservation",
      403,
    );
  }

  return prisma.reservations.update({
    where: {
      id: reservationId,
    },
    data: {
      status: "CANCELLED",
    },
  });
};

export const updateReservation = async (
  reservationId: string,
  updates: Record<string, unknown>,
) => {
  return prisma.reservations.update({
    where: {
      id: reservationId,
    },
    data: updates,
  });
};

export const completeReservation = async (
  reservationId: string,
  amountSpent: number,
  paymentMethod: $Enums.transactions_payment_method,
) => {
  if (amountSpent == null || amountSpent < 0) {
    throw new HttpError("Valid amountSpent is required", 400);
  }

  const reservation = await prisma.reservations.findUnique({
    where: { id: reservationId },
    include: { users: true },
  });

  if (!reservation) {
    throw new HttpError("Reservation not found", 404);
  }

  if (reservation.status === "COMPLETED") {
    throw new HttpError("Reservation already completed", 400);
  }

  if (reservation.status !== "CONFIRMED") {
    throw new HttpError(
      `Only CONFIRMED reservations can be completed. Current status: ${reservation.status}`,
      400,
    );
  }

  const pointsEarned = Math.floor(amountSpent);

  const updatedReservation = await prisma.reservations.update({
    where: { id: reservationId },
    data: { status: "COMPLETED" },
  });

  let updatedUser = null;

  if (reservation.user_id) {
    updatedUser = await prisma.users.update({
      where: { id: reservation.user_id },
      data: {
        earned_points: {
          increment: pointsEarned,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        earned_points: true,
      },
    });
  }

  const finalPaymentMethod =
    paymentMethod ?? reservation.users?.preferred_payment_method;

  const newTransaction = await prisma.transactions.create({
    data: {
      user_id: reservation.user_id ?? null,
      reservation_id: reservationId,
      amount_spent: amountSpent,
      points_earned: pointsEarned,
      payment_method: finalPaymentMethod,
      transaction_date: new Date(),
    },
  });

  return {
    reservation: updatedReservation,
    pointsEarned,
    user: updatedUser,
    transaction: newTransaction,
  };
};

export const confirmReservation = async (reservationId: string) => {
  const reservation = await prisma.reservations.findUnique({
    where: {
      id: reservationId,
    },
  });

  if (!reservation) {
    throw new HttpError("Reservation not found", 404);
  }

  if (reservation.status !== "PENDING") {
    throw new HttpError(
      `Only PENDING reservations can be confirmed. Current status: ${reservation.status}`,
      400,
    );
  }

  return prisma.reservations.update({
    where: {
      id: reservationId,
    },
    data: {
      status: "CONFIRMED",
    },
  });
};

export const markNoShow = async (reservationId: string) => {
  const reservation = await prisma.reservations.findUnique({
    where: { id: reservationId },
  });

  if (!reservation) {
    throw new Error("Reservation not found");
  }

  if (reservation.status !== "CONFIRMED") {
    throw new Error("Only CONFIRMED reservations can be marked as no-show");
  }

  const chargeAmount = 10.0;

  const updatedReservation = await prisma.reservations.update({
    where: { id: reservationId },
    data: { status: "NO_SHOW" },
  });

  const charge = await prisma.no_show_charges.create({
    data: {
      reservation_id: reservationId,
      user_id: reservation.user_id ?? null,
      charge_amount: chargeAmount,
      charge_status: "pending",
      charged_at: new Date(),
    },
  });

  return {
    reservation: updatedReservation,
    charge,
  };
};
