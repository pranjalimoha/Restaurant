
import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import prisma from './lib/prisma.js';

const PORT = process.env.PORT || 5000;

(async () => {
    try {
        await prisma.$connect();
    } catch (error) {
        console.log("DB CONNECT ERROR:", error.message);
    }
})();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});