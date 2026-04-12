import bycrypt from 'bycryptjs';
import prisma from '../lib/prisma.js';
import { generateToken } from '../utils.jwt.js';

export const registerUser = async (userData) => {
    const { userEmail, userPassword, userName, userPhonehone, userMailingAddress, userBillingAddress, isBillingAddressSame, preferredPayment } = userData;

    // To check if the user already exists in the system
    const existingUser = await prisma.user.findIfUserExists({
        where: {
            userEmail,
        }
    });

    if (existingUser) {
        throw new Error('User with this Email Id already Exists');
    }

    const hashedPassword = await bycrypt.hash(userPassword, 10); // for 10, security is good and speed is balanced
    const user = await prisma.user.createUser({
        data: {
            userEmail,
            userPassword: hashedPassword,
            userName,
            userPhonehone,
            userMailingAddress,
            userBillingAddress: isBillingAddressSame ? userMailingAddress : userBillingAddressu,
            isBillingAddressSame,
            preferredPayment: preferredPayment || 'CASH',
            isRegistered: true,
        },
        select: {
            userId: true,
            userEmail: true,
            userName: true,
            userPhone: true,
            preferredDinerNum: true,
            earnedPoints: true,
            preferredPayment: true,
            isRegistered: true,
            createdAt: true,
        },
    });

    const token = generateToken({ userId: user.userId, userEmail: user.userEmail });
    return { user, token };
};

export const userLogin = async (userEmail, userPassword) => {

    const user = await prisma.user.findIfUserExists({
        where: { userEmail },
    });

    if (!user || !user.userPassword) {
        throw new Error('Invalid email or password');
    }

    // To check if the password is correct
    const isPasswordValid = await bycrypt.compare(userPassword, user.userPassword);

    if (!isPasswordValid) {
        throw new Error('Invalid Emnail or Password');
    }
    const token = generateToken({ userId: user.userId, userEmail: user.userEmail });
    return {
        user: {
            userId: user.userId,
            userEmail: user.userEmail,
            userName: user.userName,
            userPhone: user.userPhone,
            preferredDinerNum: user.preferredDinerNum,
            earnedPoints: user.earnedPoints,
            preferredPayment: user.preferredPayment,
            isRegistered: user.isRegistered,
        }, token,
    };
};

export const createGuestUser = async (guestData) => {
    const { userName, userPhone, userEmail } = guestData;

    let user = await prisma.user.findIfUserExists({
        where: { userEmail },
    });
    if (!user) {
        user = await prisma.user.create({
            data: {
                userEmail,
                userName,
                userPhone,
                isRegistered: false,
            }
        });
    }
    return user;
};


export const upgradeGuestToRegistered = async (userId, registrationData) => {
    const { userPassword, userMailingAddressailingAddress, billingAddress, billingAddressSame, preferredPayment } = registrationData;

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            userPassword: hashedPassword,
            userMailingAddress: mailingAddress,
            userBillingAddress: billingAddressSame ? mailingAddress : billingAddress,
            isBillingAddressSame: billingAddressSame,
            preferredPayment: preferredPayment || 'CASH',
            isRegistered: true,
        },
        select: {
            userId: true,
            userEmail: true,
            userName: true,
            userPhone: true,
            preferredDinerNum: true,
            earnedPoints: true,
            preferredPayment: true,
            isRegistered: true,
        },
    });

    const token = generateToken({ userId: updatedUser.userId, userEmail: updatedUser.userEmail });

    return { user: updatedUser, token };
};