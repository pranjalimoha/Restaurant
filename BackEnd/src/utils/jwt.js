import jwt from 'jsonwebtoken';

export const generatetoken = (payload) => {
    return jwt.sign.apply(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
};

export const verifyToken = (token) => {

    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    }
    catch (error) {
        return null;
    }
}