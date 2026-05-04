const API_URL = import.meta.env.VITE_API_URL;

export type PaymentMethod = "CASH" | "CREDIT" | "CHECK";

export async function getAllReservationsForAdmin() {
  const response = await fetch(`${API_URL}/api/reservations/admin/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load reservations");
  }

  return data;
}

export async function completeReservationForAdmin(
  reservationId: string,
  amountSpent: number,
  paymentMethod: PaymentMethod,
) {
  const response = await fetch(`${API_URL}/api/reservations/complete/${reservationId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amountSpent,
      paymentMethod,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to complete reservation");
  }

  return data;
}

export async function markReservationNoShowForAdmin(reservationId: string) {
  const response = await fetch(`${API_URL}/api/reservations/no-show/${reservationId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to mark reservation as no-show");
  }

  return data;
}
