import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';
import { generateToken } from '../utils/jwt.js';

export const registerUser = async (userData) => {
    console.log("2. Service started");

    const {
        userEmail,
        userPassword,
        userName,
        userPhone,
        userMailingAddress,
        userBillingAddress,
        isBillingAddressSame,
        preferredPayment
    } = userData;

    console.log("3. Before findUnique");
    const existingUser = await prisma.users.findUnique({
        where: {
            email: userEmail,
        },
    });

    console.log("4. After findUnique");
    if (existingUser) {
        throw new Error('User with this Email Id already exists');
    }

    console.log("5. Before hash");
    const hashedPassword = await bcrypt.hash(userPassword, 10);
    console.log("6. After hash");

    const user = await prisma.users.create({
        data: {
            email: userEmail,
            password_hash: hashedPassword,
            name: userName,
            phone: userPhone,
            mailing_address: userMailingAddress,
            billing_address: isBillingAddressSame
                ? userMailingAddress
                : userBillingAddress,
            billing_same_as_mailing: isBillingAddressSame,
            preferred_payment_method: preferredPayment || 'CASH',
            preferred_diner_number: `DINER-${Date.now()}`
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

    console.log("7. After create");
    const token = generateToken({
        userId: user.id,
        userEmail: user.email,
    });

    return { user, token };
};

export const userLogin = async (userEmail, userPassword) => {
    const user = await prisma.users.findUnique({
        where: { email: userEmail },
    });

    if (!user || !user.password_hash) {
        throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(userPassword, user.password_hash);

    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }

    const token = generateToken({
        userId: user.id,
        userEmail: user.email,
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

export const createGuestUser = async (guestData) => {
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
                password_hash: '',
            },
        });
    }

    return user;
};

export const upgradeGuestToRegistered = async (userId, registrationData) => {
    const {
        userPassword,
        userMailingAddress,
        userBillingAddress,
        isBillingAddressSame,
        preferredPayment,
    } = registrationData;

    const hashedPassword = await bcrypt.hash(userPassword, 10);

    const updatedUser = await prisma.users.update({
        where: { id: userId },
        data: {
            password_hash: hashedPassword,
            mailing_address: userMailingAddress,
            billing_address: isBillingAddressSame
                ? userMailingAddress
                : userBillingAddress,
            billing_same_as_mailing: isBillingAddressSame,
            preferred_payment_method: preferredPayment || 'CASH',
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
        userEmail: updatedUser.email,
    });

    return { user: updatedUser, token };
};