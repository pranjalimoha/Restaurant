// =====================
// CONSTANTS
// =====================

export const guestNumberOptions = [2, 4, 6, 8, 10, 12] as const;

export type GuestCount = (typeof guestNumberOptions)[number];

// =====================
// FORM TYPES
// =====================

export type ReservationSearchFormValues = {
  date: string;
  time: string;
  numberOfGuests: GuestCount;
};

// =====================
// DOMAIN TYPES
// =====================

export type ReservationOption = {
  id: string;
  tableIds: string[];
  tableNumbers: number[];
  totalCapacity: number;
  tablesNeedCombining: boolean;
  wastedSeats: number;
};

export type ReservationStatus = "pending" | "confirmed" | "cancelled" | "completed" | "no_show";

export type ReservationConfirmation = {
  id: string;
  date: string;
  time: string;
  numberOfGuests: number;
  status: ReservationStatus;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string | null;
  tableIds: string[];
  tableNumbers: number[];
  totalCapacity: number;
  tablesNeedCombining: boolean;
  holdingFeeAmount?: number | null;
  specialDay?: boolean;
  specialDayReason?: string | null;
};

// =====================
// API TYPES
// =====================

export type ReservationSearchResponse = {
  specialDay: boolean;
  holdingFeeAmount: number;
  specialDayReason: string | null;
  options: ReservationOption[];
};

export type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
};

export type GuestDetails = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequest?: string;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// =====================
// ZUSTAND FLOW STATE
// =====================

export type ReservationFlowState = {
  searchCriteria: ReservationSearchFormValues | null;
  availableTables: ReservationOption[];
  selectedTable: ReservationOption | null;
  guestInfo: GuestReservationDetailsFormValues | null;
  reservationConfirmation: ReservationConfirmation | null;
  guestDetails: GuestDetails | null;
};

export type GuestReservationDetailsFormValues = {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
};