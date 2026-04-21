import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import tableRoutes from "./routes/tableRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({ message: "Backend is running" });
});

app.get("/health", (req, res) => {
    res.status(200).json({
        message: "Server is running",
        timestamp: new Date().toISOString(),
    });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/users", userRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;