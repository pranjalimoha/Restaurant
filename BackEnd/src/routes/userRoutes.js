import express from 'express';
import { body } from 'express-validator';
import * as userController from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';

const router = express.Router();

//All user routes require aunthentication
router.use(authenticateToken);

//Get user profile
router.get('/profile', userController.getUserProfile);

//Update user profile
router.put('/profile',
    [
        body('name').optional(),
        body('phone').optional(),
        body('mailingAddress').optional(),
        body('billingAddress').optional(),
        body('billingAddressSame').optional().isBoolean(),
        body('preffreredPayment').optional().isIn(['CASH', 'CREDIT', 'CHECK']),
        validate,
    ],
    userController.updateUserProfile
)

// Change password
router.post(
    '/change-password',
    [
        body('currentPassword').notEmpty().withMessage('Current password is required'),
        body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
        validate,
    ],
    userController.changePassword
);

//Get reservation history
router.get('/reservations', userController.getReservationHistory);

//Get payment history
router.get('/payments', userController.getPaymentHistory);

export default router;