import { create } from "zustand";
import type {
  GuestDetails,
  GuestReservationDetailsFormValues,
  ReservationConfirmation,
  ReservationFlowState,
  ReservationOption,
  ReservationSearchFormValues,
} from "../types";

type ReservationActions = {
  setSearchCriteria: (values: ReservationSearchFormValues) => void;
  setGuestDetails: (details: GuestDetails) => void;
  setAvailableTables: (options: ReservationOption[]) => void;
  selectTable: (option: ReservationOption | null) => void;
  setGuestInfo: (details: GuestReservationDetailsFormValues) => void;
  setReservationConfirmation: (confirmation: ReservationConfirmation) => void;
  clearAvailableTables: () => void;
  clearSelectedTable: () => void;
  resetReservation: () => void;
};

type ReservationStore = ReservationFlowState & ReservationActions;

const initialState: ReservationFlowState = {
  searchCriteria: null,
  availableTables: [],
  selectedTable: null,
  guestInfo: null,
  reservationConfirmation: null,
  guestDetails: null,
};

export const useReservationStore = create<ReservationStore>()((set) => ({
  ...initialState,
  setGuestDetails: (details) =>
    set(() => ({
      guestDetails: details,
    })),

  setSearchCriteria: (values) =>
    set(() => ({
      searchCriteria: values,
    })),

  setAvailableTables: (options) =>
    set(() => ({
      availableTables: options,
    })),

  selectTable: (option) =>
    set(() => ({
      selectedTable: option,
    })),

  setGuestInfo: (details) =>
    set(() => ({
      guestInfo: details,
    })),

  setReservationConfirmation: (confirmation) =>
    set(() => ({
      reservationConfirmation: confirmation,
    })),

  clearAvailableTables: () =>
    set(() => ({
      availableTables: [],
    })),

  clearSelectedTable: () =>
    set(() => ({
      selectedTable: null,
    })),

  resetReservation: () =>
    set(() => ({
      ...initialState,
    })),
}));
