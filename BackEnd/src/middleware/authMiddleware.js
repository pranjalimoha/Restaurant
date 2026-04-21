import { verifyToken } from "../utils/jwt.js";
import prisma from "../lib/prisma.js";

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided, authorization denied",
      });
    }

    const decoded = verifyToken(token);
    console.log("decoded token:", decoded);

    if (!decoded) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    const user = await prisma.users.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        preferred_diner_number: true,
        earned_points: true,
        isRegistered: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Authentication error",
      error: error.message,
    });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      const decoded = verifyToken(token);

      if (decoded) {
        const user = await prisma.users.findUnique({
          where: {
            id: decoded.userId,
          },
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            preferred_diner_number: true,
            earned_points: true,
            isRegistered: true,
          },
        });

        req.user = user || null;
      }
    }

    next();
  } catch (error) {
    next();
  }
};