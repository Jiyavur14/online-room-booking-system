/*const express = require("express");
const router = express.Router();

const {
  createRoom,
  getRoomsByHotel,
  updateRoom,
  deleteRoom,
} = require("../controllers/roomController");

const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Create room
router.post(
  "/",
  protect,
  authorizeRoles("admin", "masterAdmin"),
  createRoom
);

// Get rooms by hotel
router.get(
  "/hotel/:hotelId",
  protect,
  authorizeRoles("admin", "masterAdmin"),
  getRoomsByHotel
);

// Update room
router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "masterAdmin"),
  updateRoom
);

// Delete room
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin", "masterAdmin"),
  deleteRoom
);

module.exports = router;*/


const express = require("express");
const router = express.Router();

const {
  createRoom,
  getRoomsByHotel,
  getAdminRooms,
  updateRoom,
  deleteRoom,
  toggleRoomStatus,
} = require("../controllers/roomController");

const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

/*
--------------------------------------------------
ADMIN ROUTES
--------------------------------------------------
*/

// Create room (Admin / MasterAdmin)
router.post(
  "/",
  protect,
  authorizeRoles("admin", "masterAdmin"),
  createRoom
);

// Get rooms for admin manage table
router.get(
  "/admin",
  protect,
  authorizeRoles("admin", "masterAdmin"),
  getAdminRooms
);

// Update room
router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "masterAdmin"),
  updateRoom
);

// Delete room
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin", "masterAdmin"),
  deleteRoom
);

// Toggle room availability status
router.patch(
  "/:id/toggle-status",
  protect,
  authorizeRoles("admin", "masterAdmin"),
  toggleRoomStatus
);


/*
--------------------------------------------------
PUBLIC ROUTES (Users)
--------------------------------------------------
*/

// Get rooms by hotel (for hotel details page)
router.get("/hotel/:hotelId", getRoomsByHotel);


module.exports = router;