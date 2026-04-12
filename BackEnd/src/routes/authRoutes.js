import express from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post('/register',
    [
        body('userEmail').isEmail().withMessage('Please provide a valid email address'),
        body('userPassword').isLength({ min: 12 }).withMessage('Password must be at least 12 characters long'),
        body('userName').notEmpty().withMessage('User name is required'),
        body('userPhone').notEmpty().withMessage('User phone number is required'),
        body('userMailingAddress').optional(),
        body('userBillingAddress').optional(),
        body('isBillingAddressSame').optional().isboolean(),
        body('preferredPayment').optional().isIn(['CASH', 'CARD', 'CHECK']),
        validateRequest,
    ],
    authController.registerUser
);

//login route
router.post(
    '/login',
    [
        body('userEmail').isEmail().withMessage('Please provide a valid email address'),
        body('userPassword').notEmpty().withMessage('Password is required'),
        validateRequest,
    ],
    authController.userLogin
);

// Create guest user route
router.post(
    '/guest',
    [
        body('userName').notEmpty().withMessage('User name is required'),
        body('userPhone').notEmpty().withMessage('User phone number is required'),
        body('userEmail').isEmail().withMessage('Please provide a valid email address'),
        validateRequest,
    ],
    authController.createGuestUser
);

// Upgrade guest to registered user
router.put(
    '/guest/:userId',
    [
        body('userPassword').isLength({ min: 12 }).withMessage('Password must be at least 12 characters long'),
        body('userMailingAddress').optional(),
        body('userBillingAddress').optional(),
        body('isBillingAddressSame').optional().isboolean(),
        body('preferredPayment').optional().isIn(['CASH', 'CARD', 'CHECK']),
        validateRequest,
    ],
    authController.upgradeGuestUser
);

// Get current user (requires authentication)
router.get('/me', authenticateToken, authController.getCurrentUser);

export default router;