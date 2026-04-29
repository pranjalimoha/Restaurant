import type { NextFunction, Request, Response } from "express";

export type EmptyParams = Record<string, never>;
export type EmptyBody = Record<string, never>;
export type EmptyQuery = Record<string, never>;

export type CreateTableRequest = {
  tableNumber: number;
  capacity: number;
};

export type RestaurantTable = {
  id: string;
  table_number: number;
  capacity: number;
  is_active: boolean;
};

export type TableCombination = {
  tables: RestaurantTable[];
  totalCapacity: number;
  needsCombination: boolean;
};

export type UpdateUserProfileRequest = {
  name?: string;
  phone?: string;
  mailingAddress?: string;
  billingAddress?: string;
  preferredPaymentMethod?: string;
};

export type ChangePasswordRequest = {
  currentPassword?: string;
  newPassword?: string;
};

// ===== AUTH REQUEST BODIES =====

export type RegisterUserRequest = {
  userEmail: string;
  userPassword: string;
  userName: string;
  userPhone: string;
  userMailingAddress?: string;
  userBillingAddress?: string;
  isBillingAddressSame?: boolean;
  preferredPayment?: "CASH" | "CREDIT" | "CHECK";
};

export type LoginRequest = {
  userEmail: string;
  userPassword: string;
};

export type GuestUserRequest = {
  userName: string;
  userPhone: string;
  userEmail: string;
};

export type UpgradeGuestRequest = {
  userPassword: string;
  userMailingAddress?: string;
  userBillingAddress?: string;
  isBillingAddressSame?: boolean;
  preferredPayment?: "CASH" | "CREDIT" | "CHECK";
};

// ===== PARAMS =====

export type UserIdParams = {
  userId: string;
};

// ===== USER (what gets attached to req.user) =====

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  isGuest?: boolean;
};

export type SearchAvailableTablesInput = {
  date: Date;
  time: string;
  numberOfGuests: number;
};

export type ReservationServiceUserId = string | null;

export type AppRequest<
  Body = EmptyBody,
  Params = EmptyParams,
  Query = EmptyQuery,
> = Request<Params, unknown, Body, Query>;

export type AppResponse<T = unknown> = Response<T>;

export type AppNext = NextFunction;

export type CreateReservationRequest = {
  userId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  reservationDate: Date;
  reservationTime: string;
  numberOfGuests: number;
  selectedTableIds: string[];
  specialRequests?: string;
};

export type SearchAvailableTablesQuery = {
  date?: Date;
  time?: string;
  numberOfGuests?: string;
};

export type ReservationIdParams = {
  id: string;
};

export type CompleteReservationBody = {
  amountSpent?: number;
};

// =========================
// RESERVATIONS
// =========================

export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no_show";

export type ReservationResponse = {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  reservationDate: Date;
  reservationTime: string;
  numberOfGuests: number;
  status: ReservationStatus;
  selectedTableIds: string[];
  specialRequests?: string | null;
};

// =========================
// TABLES
// =========================

export type TableOption = {
  tableIds: string[];
  tableNumbers: number[];
  totalCapacity: number;
  tablesNeedCombining: boolean;
  wastedSeats: number;
};

// =========================
// API
// =========================

export type ApiSuccess<T> = {
  success: true;
  message?: string;
  data: T;
};

export type ApiError = {
  success: false;
  message: string;
  errors?: unknown;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
