import "dotenv/config";
import http from "node:http";
import app from "./app.js";
import prisma from "./lib/prisma.js";

const PORT = Number(process.env.PORT) || 5001;
const HOST = "0.0.0.0";

async function startServer() {
  try {
    await prisma.$connect();

    const server = http.createServer(app);

    server.listen(PORT, HOST, () => {
      console.log(`Server running on http://${HOST}:${PORT}`);
    });

    server.on("error", (error) => {
      console.error("Server error:", error);
      process.exit(1);
    });

    process.on("SIGINT", async () => {
      server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
