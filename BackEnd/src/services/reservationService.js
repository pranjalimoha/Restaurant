import prisma from '../lib/prisma.js';
import { isWeekend } from '../utils/dateHelpers.js';
import { getAvailableTablesForReservation } from './tableService.js';
import { normalizeTime } from '../utils/timeHelper.js';

export const searchAvailableTables = async (searchData) => {
    console.log('service hit');
    console.log('searchData:', searchData);

    const { date, time, numberOfGuests } = searchData;

    const isHighTrafficDay = await checkIfHighTrafficDay(date);
    console.log('isHighTrafficDay:', isHighTrafficDay);

    const result = await getAvailableTablesForReservation(date, time, numberOfGuests);
    console.log('available result:', result);

    return {
        ...result,
        requiresHoldingFee: isHighTrafficDay,
        holdingFeeAmount: isHighTrafficDay ? 10.00 : 0,
    };
};

async function checkIfHighTrafficDay(date) {
    const d = new Date(date);

    const month = d.getMonth() + 1;
    const day = d.getDate();
    const weekday = d.getDay(); // 0 = Sunday
    const weekOfMonth = Math.ceil(day / 7);

    const specialDay = await prisma.special_days.findFirst({
        where: {
            is_active: true,
            OR: [
                // fixed annual (e.g., Dec 25)
                {
                    pattern_type: 'fixed_annual',
                    month: month,
                    day: day,
                },

                // weekly (e.g., every Friday)
                {
                    pattern_type: 'weekly',
                    weekday: weekday,
                },

                // nth weekday (e.g., 2nd Sunday of May)
                {
                    pattern_type: 'nth_weekday_annual',
                    month: month,
                    weekday: weekday,
                    week_of_month: weekOfMonth,
                },

                // exact date (e.g., Easter)
                {
                    pattern_type: 'exact_date',
                    exact_date: d,
                },
            ],
        },
    });

    if (specialDay) return true;

    return isWeekend(d);
}

export const createReservation = async (reservationData, userId = null) => {
    const {
        guestName,
        guestEmail,
        guestPhone,
        reservationDate, reservationTime,
        numberOfGuests,
        selectedTableIds,
        specialRequests,
    } = reservationData;

    //first we will check if the day is high traffic day
    const isHighTrafficDay = await checkIfHighTrafficDay(reservationDate);
    const result = await getAvailableTablesForReservation(reservationDate, reservationTime, numberOfGuests);

    const availableTables = result.availableTables.map(t => t.id);
    const allTablesAvailable = selectedTableIds.every(id => availableTables.includes(id));

    if (!allTablesAvailable) {
        throw new Error('One or more selected tables are not available');
    }

    //Get table details
    const selectedTables = await prisma.restaurant_tables.findMany({
        where: { id: { in: selectedTableIds } },
    });

    const totalCapacity = selectedTables.reduce((sum, t) => sum + t.capacity, 0);
    const needsCombination = selectedTableIds.length > 1;

    //To validate capacity
    if (totalCapacity < numberOfGuests) {
        throw new Error('Selected tables do not have sufficient capacity');
    }

    //create or find user
    let finalUserId = userId;
    if (!finalUserId) {
        //gues user will be created here
        const guestUser = await prisma.users.findUnique({
            where: { email: guestEmail },
        });

        if (guestUser) {
            finalUserId = guestUser.id;
        }
        else {
            const newGuestUser = await prisma.users.create({
                data: {
                    email: guestEmail,
                    name: guestName,
                    phone: guestPhone,
                    isRegistered: false,
                }
            });
            finalUserId = newGuestUser.id;
        }
    }
    const normalizedTime = normalizeTime(reservationTime);
    //create reservation
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
            holding_fee_amount: isHighTrafficDay ? 10.00 : 0,
            tables_need_combining: needsCombination,
            special_requests: specialRequests,
            status: isHighTrafficDay ? 'PENDING' : 'CONFIRMED',
            reservation_tables: {
                create: selectedTableIds.map(tableId => ({
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
                    isRegistered: true,
                    preferred_diner_number: true,
                },
            },
        },
    });
    const combinationNote = needsCombination
        ? `Tables ${selectedTables.map(t => t.table_number).join(' + ')} combined for ${numberOfGuests} guests`
        : null;
    return {
        reservation,
        requiresRegistration: reservation.users ? !reservation.users.isRegistered : true,
        requiresHoldingFee: isHighTrafficDay,
        tablesCombined: needsCombination,
        combinationNote,
    };
};

export const getUserReservations = async (userId) => {
    const reservations = await prisma.reservations.findMany({
        where: { user_id: userId },
        include: {
            reservation_tables: {
                include: {
                    restaurant_tables: true,
                },
            },
        },
        orderBy: { reservation_date: 'desc' },
    });

    return reservations;
};

export const getReservationById = async (reservationId) => {

    const reservation = await prisma.reservations.findUnique({
        where: { id: reservationId },
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

    return reservation;
};

export const cancelReservation = async (reservationId, userId) => {
    const reservation = await prisma.reservations.findUnique({
        where: { id: reservationId },
    });
    if (!reservation) {
        throw new Error('Reservation not found');
    }
    if (reservation.user_id !== userId) {
        throw new Error('You do not have permission to cancel this reservation');
    }

    const updatedReservation = await prisma.reservations.update({
        where: { id: reservationId },
        data: { status: 'CANCELLED' },
    });
    return updatedReservation;
};

export const updateReservation = async (req, res, next) => {
    try {
        const { id } = req.params;
        const reservation = await reservationService.updateReservation(id, req.body);

        res.status(200).json({
            success: true,
            message: 'Reservation updated successfully',
            data: reservation,
        });
    } catch (error) {
        next(error);
    }
};
//mark no-show for a reservation needs to be implemented
//