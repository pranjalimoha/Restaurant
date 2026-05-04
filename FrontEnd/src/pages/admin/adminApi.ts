const API_URL = import.meta.env.VITE_API_URL;

export async function getAllReservationsForAdmin() {
  const response = await fetch(`${API_URL}/api/reservations/admin/all`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load reservations");
  }

  return data;
}
