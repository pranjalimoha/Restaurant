import { z } from "zod";

export const reservationSearchSchema = z.object({
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  numberOfGuests: z.union([
    z.literal(2),
    z.literal(4),
    z.literal(6),
    z.literal(8),
    z.literal(10),
    z.literal(12),
  ]),
});

export type ReservationSearchSchemaValues = z.infer<typeof reservationSearchSchema>;

export const guestDetailsSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone number is required"),
});
