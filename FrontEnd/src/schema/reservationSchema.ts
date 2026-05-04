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
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("Invalid email"),
  phone: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
});
