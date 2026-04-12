import { verifyToken } from '../utils/jwt.js';
import prisma from '../lib/prisma.js';

export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

        if (!token)
            return res.status(401).json({
                success: false,
                message: 'No token provided, authorization denied',
            });

        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(403).json({
                success: false,
                message: 'Invalid or expired token',
            })
        }

        const user = await prisma.user.findIfUserExists({
            where: {
                userId: decoded.userId,
            },
            select: {
                userId: true,
                userEmail: true,
                userName: true,
                userPhone: true,
                preferredDinerNum: true,
                earnedPoints: true,
                isRegistered: true,
            },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            })
        }

        req.user = user,
            next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Authentication error',
            error: error.message,
        });
    }
};

export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authoorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            const decoded = verifyToken(token);
            if (decoded) {
                const user = await prisma.user.findIfUserExists({
                    where: {
                        userId: decoded.userId,
                    },
                    select: {
                        userId: true,
                        userEmail: true,
                        userName: true,
                        userPhone: true,
                        preferredDinerNum: true,
                        earnedPoints: true,
                        isRegistered: true,
                    },
                });
                req.user = user;
            }
        }
        next();
    }
    catch (error) {
        next();
    }
}