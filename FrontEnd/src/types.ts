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
  tableNumbers: string[];
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

export type ReservationDetails = {
  id: string;
  user_id?: string | null;
  isRegisteredReservation?: boolean;

  guest_name: string | null;
  guest_email: string | null;
  guest_phone: string | null;
  reservation_date: string;
  reservation_time: string;
  number_of_guests: number;
  status: string;
  requires_holding_fee: boolean;
  holding_fee_amount: string;

  users?: {
    isRegistered: boolean | null;
  } | null;

  reservation_tables: {
    restaurant_tables: {
      table_number: number;
      capacity: number;
    };
  }[];
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

export type ReservationMode = "guest" | "registered" | null;

export type ReservationFlowState = {
  reservationMode: ReservationMode;
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

export type CompleteReservationBody = {
  amountSpent: number;
  paymentMethod: "CASH" | "CREDIT" | "CHECK";
};

export type ReservationResponse = {
  reservation: ReservationDetails;
  isRegisteredUser: boolean;
};
