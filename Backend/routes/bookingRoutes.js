const express = require("express");
const router = express.Router();

const {
  checkAvailability,
  createBooking,
  confirmBooking,
  getMyBookings,
  cancelBooking,
  payBooking,
  refundBooking
} = require("../controllers/bookingController");

const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Public availability check
router.get("/availability", checkAvailability);

// Create booking
router.post("/", protect, createBooking);

// Confirm booking
router.put("/:id/confirm", protect, confirmBooking);

// My bookings
router.get("/my-bookings", protect, getMyBookings);

// Cancel booking
router.patch("/:id/cancel", protect, cancelBooking);

// Pay booking
router.patch("/:id/pay",protect,payBooking);

// Refund booking
router.patch("/:id/refund",protect,authorizeRoles("admin","masterAdmin"),refundBooking);

module.exports = router;