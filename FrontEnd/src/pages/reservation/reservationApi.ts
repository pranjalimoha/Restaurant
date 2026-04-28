import type { GuestDetails, ReservationOption, ReservationSearchFormValues } from "../../types";

type CreateReservationPayload = {
  searchCriteria: ReservationSearchFormValues;
  selectedTable: ReservationOption;
  guestInfo: GuestDetails;
};

export async function createReservation(payload: CreateReservationPayload) {
  const requestBody = {
    guestName: `${payload.guestInfo.firstName} ${payload.guestInfo.lastName}`,
    guestEmail: payload.guestInfo.email,
    guestPhone: payload.guestInfo.phone,
    reservationDate: payload.searchCriteria.date,
    reservationTime: payload.searchCriteria.time,
    numberOfGuests: payload.searchCriteria.numberOfGuests,
    selectedTableIds: payload.selectedTable.tableIds,
    specialRequests: payload.guestInfo.specialRequest,
  };
  console.log("Create reservation request body:", requestBody);
  const response = await fetch("http://localhost:5001/api/reservations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to create reservation");
  }
  return data;
}

export async function searchAvailableTables(values: ReservationSearchFormValues) {
  const params = new URLSearchParams({
    date: values.date,
    time: values.time,
    numberOfGuests: String(values.numberOfGuests),
  });
  const API_URL = "http://localhost:5001";

  const response = await fetch(`${API_URL}/api/reservations/search?${params}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to search available tables");
  }
  return data;
}
