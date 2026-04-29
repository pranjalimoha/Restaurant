import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import type { users_preferred_payment_method } from "@prisma/client";
import type { users } from "@prisma/client";

type UpdateUserData = {
  name?: string;
  phone?: string;
  mailing_address?: string;
  billing_address?: string;
  billing_same_as_mailing?: boolean;
  preferred_payment_method?: users_preferred_payment_method | null;
};

export const getUserProfile = async (userId: string): Promise<any> => {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      mailing_address: true,
      billing_address: true,
      billing_same_as_mailing: true,
      preferred_diner_number: true,
      earned_points: true,
      preferred_payment_method: true,
      isRegistered: true,
      created_at: true,
      updated_at: true,
    },
  });

  return user;
};

export const updateUserProfile = async (
  userId: string,
  updatedData: UpdateUserData,
) => {
  const {
    name,
    phone,
    mailing_address,
    billing_address,
    billing_same_as_mailing,
    preferred_payment_method,
  } = updatedData;

  const data: UpdateUserData = {
    ...(name !== undefined && { name }),
    ...(phone !== undefined && { phone }),
    ...(mailing_address !== undefined && { mailing_address }),
    ...(billing_same_as_mailing !== undefined && { billing_same_as_mailing }),
    ...(preferred_payment_method !== undefined && {
      preferred_payment_method,
    }),
  };

  if (billing_same_as_mailing === true && mailing_address !== undefined) {
    data.billing_address = mailing_address;
  } else if (
    billing_same_as_mailing === false &&
    billing_address !== undefined
  ) {
    data.billing_address = billing_address;
  }

  const user = await prisma.users.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      mailing_address: true,
      billing_address: true,
      billing_same_as_mailing: true,
      preferred_diner_number: true,
      earned_points: true,
      preferred_payment_method: true,
      isRegistered: true,
    },
  });

  return user;
};

export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string,
) => {
  const user = await prisma.users.findUnique({
    where: { id: userId },
  });

  if (!user || !user.password_hash) {
    throw new Error("User not found or password not set");
  }

  const isPasswordValid = await bcrypt.compare(
    currentPassword,
    user.password_hash
  );

  if (!isPasswordValid) {
    throw new Error("Current password is incorrect");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.users.update({
    where: { id: userId },
    data: { password_hash: hashedPassword },
  });

  return { message: "Password updated successfully" };
};

export const getUserReservationHistory = async (userId: string) => {
  return await prisma.reservations.findMany({
    where: { user_id: userId },
    include: {
      reservation_tables: {
        include: {
          restaurant_tables: true,
        },
      },
    },
    orderBy: { reservation_date: "desc" },
  });
};

export const getUserPayments = async (userId: string) => {
  return await prisma.transactions.findMany({
    where: { user_id: userId },
    include: {
      reservations: {
        select: {
          id: true,
          reservation_date: true,
          reservation_time: true,
          number_of_guests: true,
        },
      },
    },
    orderBy: { created_at: "desc" },
  });
};