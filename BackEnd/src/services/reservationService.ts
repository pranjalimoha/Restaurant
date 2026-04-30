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

export const authorizeHoldingFee = async (reservationId: string) => {
  const reservation = await prisma.reservations.findUnique({
    where: { id: reservationId },
  });
  if (!reservation) {
    throw new Error("Reservation not found");
  }
  if (!reservation.requires_holding_fee) {
    throw new Error("This reservation does not require a holding fee");
  }
  if (reservation.status !== "PENDING") {
    throw new Error(`Only PENDING reservations can be confirmed. Current status: ${reservation.status}`);
  }
  return prisma.reservations.update({
    where: { id: reservationId },
    data: {
      holding_fee_paid: true,
      status: "CONFIRMED",
    },
  });
};

async function checkIfHighTrafficDay(date: Date): Promise<boolean> {
  const d = new Date(date);

  const month = d.getMonth() + 1;
  const day = d.getDate();
  const weekday = d.getDay();
  const weekOfMonth = Math.ceil(day / 7);

  const specialDay = await prisma.special_days.findFirst({
    where: {
      is_active: true,
      OR: [
        {
          pattern_type: "fixed_annual",
          month,
          day,
        },
        {
          pattern_type: "weekly",
          weekday,
        },
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

  const normalizedTime = normalizeTime(reservationTime);

  const reservationDateTime = new Date(
    `${reservationDate}T${normalizedTime}:00`,
  );

  const now = new Date();

  if (Number.isNaN(reservationDateTime.getTime())) {
    throw new Error("Invalid reservation date or time");
  }

  const [hour, minute] = normalizedTime.split(":").map(Number);
  const selectedMinutes = hour * 60 + minute;

  const openingMinutes = 10 * 60; // 10:00 AM
  const closingMinutes = 22 * 60; // 10:00 PM

  if (selectedMinutes < openingMinutes || selectedMinutes > closingMinutes) {
    throw new Error("Reservations are only allowed between 10:00 AM and 10:00 PM");
  }

  if (reservationDateTime.getTime() < now.getTime()) {
    throw new Error("Cannot create a reservation for a past date or time");
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
    throw new Error(
      "One or more selected tables are already reserved for this date and time",
    );
  }

  const isHighTrafficDay = await checkIfHighTrafficDay(reservationDate);
  const holdingFeeAmount = isHighTrafficDay ? 10.0 : 0;

  const result = await getAvailableTablesForReservation(
    reservationDate,
    normalizedTime,
    numberOfGuests,
  );

  const availableTableIds = result.availableTables.map((table) => table.id);

  const allTablesAvailable = selectedTableIds.every((id) =>
    availableTableIds.includes(id),
  );

  if (!allTablesAvailable) {
    throw new Error("One or more selected tables are not available");
  }

  const selectedTables = await prisma.restaurant_tables.findMany({
    where: {
      id: {
        in: selectedTableIds,
      },
    },
  });

  const totalCapacity = selectedTables.reduce(
    (sum, table) => sum + table.capacity,
    0,
  );

  const needsCombination = selectedTableIds.length > 1;

  if (totalCapacity < numberOfGuests) {
    throw new Error("Selected tables do not have sufficient capacity");
  }

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
      throw new Error("Registered user not found");
    }
  }

  const reservation = await prisma.reservations.create({
    data: {
      user_id: finalUserId ?? null,
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
    throw new Error("Reservation not found");
  }

  if (reservation.user_id !== userId) {
    throw new Error("You do not have permission to cancel this reservation");
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
  if (amountSpent == null || amountSpent <= 0) {
    throw new Error("Valid amountSpent is required");
  }

  const reservation = await prisma.reservations.findUnique({
    where: { id: reservationId },
    include: { users: true },
  });

  if (!reservation) {
    throw new Error("Reservation not found");
  }

  if (reservation.status === "COMPLETED") {
    throw new Error("Reservation already completed");
  }

  if (reservation.status !== "CONFIRMED") {
    throw new Error(
      `Only CONFIRMED reservations can be completed. Current status: ${reservation.status}`,
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
    throw new Error("Reservation not found");
  }

  if (reservation.status !== "PENDING") {
    throw new Error(
      `Only PENDING reservations can be confirmed. Current status: ${reservation.status}`,
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
