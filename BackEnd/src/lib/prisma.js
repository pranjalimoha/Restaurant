<<<<<<< HEAD
import dotenv from "dotenv";
dotenv.config();

=======
import "dotenv/config";
>>>>>>> cbae248bd4b8b3712ce2596d55b992ccdc923a83
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb({
<<<<<<< HEAD
    connectionString: process.env.DATABASE_URL,
=======
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    connectionLimit: 5,
>>>>>>> cbae248bd4b8b3712ce2596d55b992ccdc923a83
});

const prisma = new PrismaClient({ adapter });

export default prisma;