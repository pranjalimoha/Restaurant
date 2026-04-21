import * as userService from "../services/userService.js";

export const getUserProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await userService.getUserProfile(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
}

export const updateUserProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await userService.updateUserProfile(userId, req.body);
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: user,
        });
    }
    catch (next) {
        next(error);
    }
};

export const changePassword = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required',
            });
        }

        const result = await userService.changePassword(userId, currentPassword, newPassword);

        res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        next(error);
    }
};

export const getReservationHistory = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const reservations = await userService.getUserReservationHistory(userId);

        res.status(200).json({
            success: true,
            data: reservations,
        });
    } catch (error) {
        next(error);
    }
};

export const getPaymentHistory = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const payments = await userService.getUserPayments(userId);

        res.status(200).json({
            success: true,
            data: payments,
        });
    } catch (error) {
        next(error);
    }
};