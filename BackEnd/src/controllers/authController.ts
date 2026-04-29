import * as authService from "../services/authService.js";
import type {
  AppNext,
  AppRequest,
  AppResponse,
  GuestUserRequest,
  LoginRequest,
  RegisterUserRequest,
  UpgradeGuestRequest,
  UserIdParams,
} from "../types";

// Register
export const registerUser = async (
  req: AppRequest<RegisterUserRequest>,
  res: AppResponse,
  next: AppNext,
) => {
  try {
    const result = await authService.registerUser(req.body);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

// Login
export const userLogin = async (
  req: AppRequest<LoginRequest>,
  res: AppResponse,
  next: AppNext,
) => {
  try {
    const { userEmail, userPassword } = req.body;

    const result = await authService.userLogin(userEmail, userPassword);

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

// Guest
export const createGuestUser = async (
  req: AppRequest<GuestUserRequest>,
  res: AppResponse,
  next: AppNext,
) => {
  try {
    const guestUser = await authService.createGuestUser(req.body);

    return res.status(201).json({
      success: true,
      message: "Guest user created successfully",
      data: guestUser,
    });
  } catch (error) {
    return next(error);
  }
};

// Upgrade guest
export const upgradeGuest = async (
  req: AppRequest<UpgradeGuestRequest, UserIdParams>,
  res: AppResponse,
  next: AppNext,
) => {
  try {
    const { userId } = req.params;

    const result = await authService.upgradeGuestToRegistered(userId, req.body);

    return res.status(200).json({
      success: true,
      message: "Guest upgraded successfully",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

// Current user
export const getCurrentUser = async (
  req: AppRequest,
  res: AppResponse,
  next: AppNext,
) => {
  try {
    return res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    return next(error);
  }
};
