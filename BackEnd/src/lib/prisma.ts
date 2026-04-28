import "dotenv/config";
import pkg from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const { PrismaClient } = pkg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}

const databaseUrl = new URL(process.env.DATABASE_URL);

const adapter = new PrismaMariaDb({
  host: databaseUrl.hostname,
  port: Number(databaseUrl.port),
  user: decodeURIComponent(databaseUrl.username),
  password: decodeURIComponent(databaseUrl.password),
  database: databaseUrl.pathname.replace("/", ""),
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

export default prisma;