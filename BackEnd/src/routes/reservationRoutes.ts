import express from "express";
import { body, query } from "express-validator";
import * as reservationController from "../controllers/reservationController.js";

import {
  authenticateToken,
  optionalAuth,
} from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "Reservation route working" });
});

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
  reservationController.searchAvailableTables,
);

// Create Reservation
router.post(
  "/",
  optionalAuth,
  [
    body("guestName").notEmpty().withMessage("Guest name is required"),
    body("guestEmail").isEmail().withMessage("Valid email is required"),
    body("guestPhone").notEmpty().withMessage("Guest phone number is required"),
    body("reservationDate")
      .notEmpty()
      .withMessage("Reservation date is required"),
    body("reservationTime")
      .notEmpty()
      .withMessage("Reservation time is required"),
    body("numberOfGuests")
      .isInt({ min: 1 })
      .withMessage("Number of guests must be at least 1"),
    body("selectedTableIds")
      .isArray({ min: 1 })
      .withMessage("At least one table must be selected"),
    validate,
  ],
  reservationController.createReservation,
);

// Complete reservation
router.post("/complete/:id", reservationController.completeReservation);

// Confirm reservation
router.post("/confirm/:id", reservationController.confirmReservation);

// No-show
router.post("/no-show/:id", reservationController.markNoShow);

// Admin
router.get("/admin/all", reservationController.getAllReservations);

// Get user's reservations
router.get(
  "/my-reservations",
  authenticateToken,
  reservationController.getUserReservations,
);

// Holding fee
router.post(
  "/:id/authorize-holding-fee",
  reservationController.authorizeHoldingFee,
);

// Update / cancel
router.put("/:id", authenticateToken, reservationController.updateReservation);

router.put(
  "/:id/cancel",
  authenticateToken,
  reservationController.cancelReservation,
);

// LAST: generic ID route
router.get("/:id", reservationController.getReservationById);

export default router;