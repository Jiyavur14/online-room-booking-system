const express = require("express");
const router = express.Router();
const { createHotel, getHotels, getHotelById, toggleHotelStatus, updateHotel, deleteHotel } = require("../controllers/hotelController");
const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");
const protectOptional = require("../middleware/protectOptional");




// Create hotel
router.post(
  "/",
  protect,
  authorizeRoles("admin", "masterAdmin"),
  upload.array("images",4),
  createHotel
);

// Get hotels
router.get(
  "/",
  protectOptional,
  getHotels
);

//gethotelbyid
router.get(
  "/:id",getHotelById
)


//Toggling Hotel
router.patch(
  "/toggle/:id",
  protect,
  authorizeRoles("masterAdmin"),
  toggleHotelStatus
);


// Update hotel
router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "masterAdmin"),
  updateHotel
);

// Delete hotel
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin", "masterAdmin"),
  deleteHotel
);

module.exports = router;