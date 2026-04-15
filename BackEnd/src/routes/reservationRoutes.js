import express from 'express';
import { body, query } from 'express-validator';
import * as reservationController from '../controllers/reservationController.js';
import { authenticateToken, optionalAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.get(
    '/search',
    [
        body('reservationDate').notEmpty().withMessage('Reservation date is required'),
        body('reservationTime').notEmpty().withMessage('Reservation time is required'),
        body('numberOfGuests').isInt({ min: 1 }).withMessage('Number of guests must be at least 1'),
        validate,
    ],
    reservationController.searchTableAvailability
);

