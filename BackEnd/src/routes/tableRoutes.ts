import express from "express";
import { body, query } from "express-validator";
import * as tableController from "../controllers/tableController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.get("/", tableController.getAllTables);

router.get(
  "/search",
  [
    query("date").notEmpty().withMessage("Date is required"),
    query("time").notEmpty().withMessage("Time is required"),
    query("numberOfGuests")
      .isInt({ min: 1 })
      .withMessage("Number of guests must be at least 1"),
    validate,
  ],
  tableController.getAvailableTablesForReservation,
);

router.get("/:id", tableController.getTableById);

router.post(
  "/",
  authenticateToken,
  [
    body("tableNumber").notEmpty().withMessage("Table number is required"),
    body("capacity")
      .isInt({ min: 1 })
      .withMessage("Capacity must be at least 1"),
    validate,
  ],
  tableController.createTable,
);

export default router;
