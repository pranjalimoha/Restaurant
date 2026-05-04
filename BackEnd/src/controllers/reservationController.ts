import * as reservationService from "../services/reservationService.js";
import type {
  AppNext,
  AppRequest,
  AppResponse,
  CompleteReservationBody,
  CreateReservationRequest,
  EmptyBody,
  EmptyParams,
  ReservationIdParams,
  SearchAvailableTablesQuery,
} from "../types.js";

export const searchAvailableTables = async (
  req: AppRequest<EmptyBody, EmptyParams, SearchAvailableTablesQuery>,
  res: AppResponse,
  next: AppNext,
) => {
  try {
    const { date, time, numberOfGuests } = req.query;

    if (!date || !time || !numberOfGuests) {
      return res.status(400).json({
        success: false,
        message: "Date, time, and numberOfGuests are required",
      });
    }

    const result = await reservationService.searchAvailableTables({
      date,
      time,
      numberOfGuests: Number.parseInt(numberOfGuests, 10),
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const getAllReservations = async (
  req: AppRequest,
  res: AppResponse,
  next: AppNext,
) => {
  try {
    const reservations = await reservationService.getAllReservations();

    res.status(200).json({
      success: true,
      data: reservations,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const authorizeHoldingFee = async (
  req: AppRequest<EmptyBody, ReservationIdParams>,
  res: AppResponse,
  next: AppNext,
) => {
  try {
    const { id } = req.params;

    const result = await reservationService.authorizeHoldingFee(id);

    res.status(200).json({
      success: true,
      message: "Holding fee authorized successfully",
      data: result,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const createReservation = async (
  req: AppRequest<CreateReservationRequest>,
  res: AppResponse,
  next: AppNext,
) => {
  try {
    const userId = req.user?.id ?? null;

    console.log("Reservation create userId:", userId);

    const result = await reservationService.createReservation(req.body, userId);

    res.status(201).json({
      success: true,
      message: "Reservation created successfully",
      data: result,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const getUserReservations = async (
  req: AppRequest,
  res: AppResponse,
  next: AppNext,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    const userReservations =
      await reservationService.getUserReservations(userId);

    return res.status(200).json({
      success: true,
      data: userReservations,
    });
  } catch (error) {
    return next(error);
  }
};

export const getReservationById = async (
  req: AppRequest<EmptyBody, ReservationIdParams>,
  res: AppResponse,
  next: AppNext,
) => {
  try {
    const { id } = req.params;

    const reservation = await reservationService.getReservationById(id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    return next(error);
  }
};

export const cancelReservation = async (
  req: AppRequest<EmptyBody, ReservationIdParams>,
  res: AppResponse,
  next: AppNext,
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    const cancelledReservation = await reservationService.cancelReservation(
      id,
      userId,
    );

    return res.status(200).json({
      success: true,
      message: "Reservation cancelled successfully",
      data: cancelledReservation,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateReservation = async (
  req: AppRequest<Record<string, unknown>, ReservationIdParams>,
  res: AppResponse,
  next: AppNext,
) => {
  try {
    const { id } = req.params;

    const reservation = await reservationService.updateReservation(
      id,
      req.body,
    );

    return res.status(200).json({
      success: true,
      message: "Reservation updated successfully",
      data: reservation,
    });
  } catch (error) {
    return next(error);
  }
};

export const completeReservation = async (
  req: AppRequest<CompleteReservationBody, ReservationIdParams>,
  res: AppResponse,
  next: AppNext,
) => {
  try {
    const { id } = req.params;
    const { amountSpent, paymentMethod } = req.body;

    // ✅ validate amount
    if (!amountSpent || amountSpent <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid amount spent is required",
      });
    }

    // ✅ validate payment method
    const validMethods = ["CASH", "CREDIT", "CHECK"];
    if (!paymentMethod || !validMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Valid payment method is required",
      });
    }

    // ✅ call service with payment method
    const result = await reservationService.completeReservation(
      id,
      amountSpent,
      paymentMethod,
    );

    return res.status(200).json({
      success: true,
      message: "Reservation completed successfully",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const confirmReservation = async (
  req: AppRequest<EmptyBody, ReservationIdParams>,
  res: AppResponse,
  next: AppNext,
) => {
  try {
    const { id } = req.params;

    const result = await reservationService.confirmReservation(id);

    return res.status(200).json({
      success: true,
      message: "Reservation confirmed successfully",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const markNoShow = async (
  req: AppRequest<EmptyBody, ReservationIdParams>,
  res: AppResponse,
  next: AppNext,
) => {
  try {
    const { id } = req.params;

    const result = await reservationService.markNoShow(id);

    return res.status(200).json({
      success: true,
      message: "Reservation marked as no-show",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};
