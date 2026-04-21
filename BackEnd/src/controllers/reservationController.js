import * as reservationService from '../services/reservationService.js';

//Find available tables for a given date, time, and guest count
export const searchAvailableTables = async (req, res, next) => {
    try {
        const { date, time, numberOfGuests } = req.query;

        if (!date || !time || !numberOfGuests) {
            return res.status(400).json({
                success: false,
                message: 'Date, time, and numberOfGuests are required',
            });
        }

        const result = await reservationService.searchAvailableTables({
            date,
            time,
            numberOfGuests: parseInt(numberOfGuests),
        });

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

//Create a new reservation for the user or guest
export const createReservation = async (req, res, next) => {
    try {
        const userId = req.userId ? req.userId : null;
        const result = await reservationService.createReservation(req.body, userId);

        res.status(200).json({
            success: true,
            message: 'Reservation created successfully',
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

//Get all reservations made by the logged-in user
export const getUserReservations = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const userReservations = await reservationService.getUserReservations(userId);

        res.status(200).json({
            success: true,
            data: userReservations,
        });
    } catch (error) {
        next(error);
    }
};

//Get details of a specific reservation by its ID
export const getReservationById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const reservation = await reservationService.getReservationById(id);

        if (!reservation) {
            return res.status(400).json({
                success: false,
                message: 'Reservations not found',
            });
        }

        res.status(200).json({
            success: true,
            data: reservation,
        })
    }
    catch (error) {
        next(error);
    }
};

//Cancel an existing reservation
export const cancelReservation = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const deletedReservation = await reservationService.cancelReservation(id, userId);
        if (!deletedReservation) {
            return res.status(200).json({
                success: true,
                message: 'Reservation cancelled successfully',
                data: reservation,
            });
        }
    }
    catch (error) {
        next(error);
    }
}

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

// Mark a reservation as completed and record the amount spent
export const completeReservation = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { amountSpent } = req.body;

        if (!amountSpent || amountSpent <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Valid amount spent is required',
            });
        }

        const result = await reservationService.completeReservation(id, amountSpent);

        res.status(200).json({
            success: true,
            message: 'Reservation completed successfully',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const confirmReservation = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await reservationService.confirmReservation(id);

        res.status(200).json({
            success: true,
            message: 'Reservation confirmed successfully',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};