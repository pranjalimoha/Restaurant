import * as userService from "../services/userService.js";
import type {
  AppNext,
  AppRequest,
  AppResponse,
  ChangePasswordRequest,
  UpdateUserProfileRequest,
} from "../types.js";

function getAuthenticatedUserId(req: AppRequest): string | null {
  return req.user?.id ?? req.userId ?? null;
}

export const getUserProfile = async (
  req: AppRequest,
  res: AppResponse,
  next: AppNext,
) => {
  try {
    const userId = getAuthenticatedUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    const user = await userService.getUserProfile(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateUserProfile = async (
  req: AppRequest<UpdateUserProfileRequest>,
  res: AppResponse,
  next: AppNext,
) => {
  try {
    const userId = getAuthenticatedUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    const user = await userService.updateUserProfile(userId, req.body);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    return next(error);
  }
};

export const changePassword = async (
  req: AppRequest<ChangePasswordRequest>,
  res: AppResponse,
  next: AppNext,
) => {
  try {
    const userId = getAuthenticatedUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    const result = await userService.changePassword(
      userId,
      currentPassword,
      newPassword,
    );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return next(error);
  }
};

export const getReservationHistory = async (
  req: AppRequest,
  res: AppResponse,
  next: AppNext,
) => {
  try {
    const userId = getAuthenticatedUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    const reservations = await userService.getUserReservationHistory(userId);

    return res.status(200).json({
      success: true,
      data: reservations,
    });
  } catch (error) {
    return next(error);
  }
};

export const getPaymentHistory = async (
  req: AppRequest,
  res: AppResponse,
  next: AppNext,
) => {
  try {
    const userId = getAuthenticatedUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    const payments = await userService.getUserPayments(userId);

    return res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    return next(error);
  }
};
