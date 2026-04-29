import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import type {
  GuestUserRequest,
  LoginRequest,
  RegisterUserRequest,
  UpgradeGuestRequest,
} from "../types.js";
import { generateToken } from "../utils/jwt.js";

export const registerUser = async (userData: RegisterUserRequest) => {
  const {
    userEmail,
    userPassword,
    userName,
    userPhone,
    userMailingAddress,
    userBillingAddress,
    isBillingAddressSame = false,
    preferredPayment,
  } = userData;

  const existingUser = await prisma.users.findUnique({
    where: {
      email: userEmail,
    },
  });

  if (existingUser) {
    throw new Error("User with this Email Id already exists");
  }

  const hashedPassword = await bcrypt.hash(userPassword, 10);

  const user = await prisma.users.create({
    data: {
      email: userEmail,
      password_hash: hashedPassword,
      name: userName,
      phone: userPhone,
      mailing_address: userMailingAddress ?? null,
      billing_address: isBillingAddressSame
        ? (userMailingAddress ?? null)
        : (userBillingAddress ?? null),
      billing_same_as_mailing: isBillingAddressSame,
      preferred_payment_method: preferredPayment ?? "CASH",
      preferred_diner_number: `DINER-${Date.now()}`,
    },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      preferred_diner_number: true,
      earned_points: true,
      preferred_payment_method: true,
      created_at: true,
    },
  });

  const token = generateToken({
    userId: user.id,
  });

  return { user, token };
};

export const userLogin = async (
  userEmail: LoginRequest["userEmail"],
  userPassword: LoginRequest["userPassword"],
) => {
  const user = await prisma.users.findUnique({
    where: { email: userEmail },
  });

  if (!user || !user.password_hash) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(
    userPassword,
    user.password_hash,
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken({
    userId: user.id,
  });

  return {
    user: {
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      userPhone: user.phone,
      preferredDinerNum: user.preferred_diner_number,
      earnedPoints: user.earned_points,
      preferredPayment: user.preferred_payment_method,
    },
    token,
  };
};

export const createGuestUser = async (guestData: GuestUserRequest) => {
  const { userName, userPhone, userEmail } = guestData;

  let user = await prisma.users.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    user = await prisma.users.create({
      data: {
        email: userEmail,
        name: userName,
        phone: userPhone,
        preferred_diner_number: `GUEST-${Date.now()}`,
        password_hash: "",
      },
    });
  }

  return user;
};

export const upgradeGuestToRegistered = async (
  userId: string,
  registrationData: UpgradeGuestRequest,
) => {
  const {
    userPassword,
    userMailingAddress,
    userBillingAddress,
    isBillingAddressSame = false,
    preferredPayment,
  } = registrationData;

  const hashedPassword = await bcrypt.hash(userPassword, 10);

  const updatedUser = await prisma.users.update({
    where: { id: userId },
    data: {
      password_hash: hashedPassword,
      mailing_address: userMailingAddress ?? null,
      billing_address: isBillingAddressSame
        ? (userMailingAddress ?? null)
        : (userBillingAddress ?? null),
      billing_same_as_mailing: isBillingAddressSame,
      preferred_payment_method: preferredPayment ?? "CASH",
    },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      preferred_diner_number: true,
      earned_points: true,
      preferred_payment_method: true,
    },
  });

  const token = generateToken({
    userId: updatedUser.id,
  });

  return { user: updatedUser, token };
};
