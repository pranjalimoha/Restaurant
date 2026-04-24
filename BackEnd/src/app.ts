import cors from "cors";
import express from "express";
import { errorHandler, notFound } from "./middleware/errorMiddleware";
import authRoutes from "./routes/authRoutes";
import reservationRoutes from "./routes/reservationRoutes";
import tableRoutes from "./routes/tableRoutes";
import userRoutes from "./routes/userRoutes";

const app = express();

const corsOptions = {
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// explicitly handle preflight
app.options(/.*/, cors(corsOptions));

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
