const Room = require("../models/Room");
const Hotel = require("../models/Hotel");


// -------------------------------------
// CREATE ROOM
// -------------------------------------
exports.createRoom = async (req, res) => {
  try {
    const { hotel, roomType, pricePerNight, totalRooms, amenities } = req.body;

    const existingHotel = await Hotel.findById(hotel);
    if (!existingHotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Ownership check
    if (
      existingHotel.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "masterAdmin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Create the room
    const room = await Room.create({
      hotel,
      roomType,
      pricePerNight,
      totalRooms,
      amenities,
      createdBy: req.user._id,
    });

    // --- NEW: Update hotel minPrice ---
    const rooms = await Room.find({ hotel });
    const minPrice = rooms.length > 0 ? Math.min(...rooms.map(r => r.pricePerNight)) : null;

    await Hotel.findByIdAndUpdate(hotel, { minPrice });

    // Return room + hotel info
    const populatedRoom = await Room.findById(room._id).populate("hotel", "name location");
    res.status(201).json({
      message: "Room created successfully",
      room: populatedRoom,
      minPrice,
    });

  } catch (error) {
    console.error("CREATE ROOM ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


// -------------------------------------
// GET ROOMS BY HOTEL (Public Hotel Page)
// Only show enabled rooms
// -------------------------------------
exports.getRoomsByHotel = async (req, res) => {
  try {
    const rooms = await Room.find({
      hotel: req.params.hotelId,
      status: true, // very important
    });

    res.json(rooms);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// -------------------------------------
// GET ROOMS FOR ADMIN TABLE
// -------------------------------------
exports.getAdminRooms = async (req, res) => {
  try {
    const rooms = await Room.find({
      createdBy: req.user._id,
    })
      .populate("hotel", "name location")
      .sort({ createdAt: -1 });

    res.json(rooms);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// -------------------------------------
// UPDATE ROOM
// -------------------------------------
exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (
      room.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "masterAdmin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedRoom);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// -------------------------------------
// DELETE ROOM
// -------------------------------------
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (
      room.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "masterAdmin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    await room.deleteOne();

    res.json({ message: "Room deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// -------------------------------------
// TOGGLE ROOM STATUS (Enable / Disable)
// -------------------------------------
exports.toggleRoomStatus = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (
      room.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "masterAdmin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    room.status = !room.status;
    await room.save();

    res.json({
      message: "Room status updated successfully",
      status: room.status,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};