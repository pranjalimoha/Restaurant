import * as authService from '../services/authService.js';

export const registerUser = async (req, res, next) => {
    try {
        console.log("1. Controller hit");
        const result = await authService.registerUser(req.body);
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: result,
        });
    } catch (error) {
        console.log("1X. Controller catch:", error.message);
        next(error);
    }
};

export const userLogin = async (req, res, next) => {

    try {
        const { userEmail, userPassword } = req.body;
        const result = await authService.userLogin(userEmail, userPassword);
        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const createGuestUser = async (req, res, next) => {

    try {

        const guestUser = await authService.createGuestUser(req.body);
        res.status(201).json({
            success: true,
            message: 'Guest user created successfully',
            data: guestUser,
        });
    }
    catch (error) {
        next(error);
    }
};

export const upgradeGuest = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const result = await authService.upgradeGuestToRegistered(userId, req.body);

        res.status(200).json({
            success: true,
            message: 'Guest upgraded to registered user successfully',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const getCurrentUser = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            data: req.user,
        });
    } catch (error) {
        next(error);
    }
};