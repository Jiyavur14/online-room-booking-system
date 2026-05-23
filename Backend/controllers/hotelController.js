const Hotel = require("../models/Hotel");
const Room = require("../models/Room");
/**
 * @desc    Create new hotel
 * @route   POST /api/hotels
 * @access  Admin / MasterAdmin
 */


   exports.createHotel = async (req, res) => {
  try {
    const { name, location, description, rating } = req.body;

      const imagePaths = req.files
          ? req.files.map(file => file.path.replace(/\\/g, "/"))
           : [];


    // Handle amenities JSON
      let amenitiesArray = [];

        if (req.body.amenities) {

          if (Array.isArray(req.body.amenities)) {
            // case 1: frontend sends array
            amenitiesArray = req.body.amenities;

          } else if (typeof req.body.amenities === "string") {

            try {
              // case 2: frontend sends JSON string
              amenitiesArray = JSON.parse(req.body.amenities);
            } catch {
              // case 3: single value
              amenitiesArray = [req.body.amenities];
            }

          }

        }

    const hotel = await Hotel.create({
      name,
      location,
      description,
      images: imagePaths,
      amenities: amenitiesArray,
      rating: rating || 0,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Hotel created successfully",
      hotel,
    });

  } catch (error) {
    console.error("CREATE HOTEL ERROR:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};




/**
 * @desc    Get hotels (role-based access)
 * @route   GET /api/hotels
 * @access  Admin / MasterAdmin
 */
exports.getHotels = async (req, res) => {

  try {

    let query = { isActive: true };

    if (req.user) {

      if (req.user.role === "admin") {

        // Admin sees only their hotels

        query = {

          createdBy: req.user._id,

          isActive: true,

        };

      }

      if (req.user.role === "masterAdmin") {

        // Master admin sees ALL hotels

        query = {};

      }

    }

    const hotels = await Hotel.find(query);

    const hotelsWithMinPrice = await Promise.all(

      hotels.map(async (hotel) => {

        const rooms = await Room.find({

          hotel: hotel._id,

        });

        const minPrice =

          rooms.length > 0

            ? Math.min(...rooms.map((r) => r.pricePerNight))

            : null;

        return {

          ...hotel.toObject(),

          minPrice,

        };

      })

    );

    res.status(200).json(hotelsWithMinPrice);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};

    exports.getHotelById = async (req, res) => {
      try {
            const hotel = await Hotel.findById(req.params.id);
              if (!hotel) {
                return res.status(404).json({ message: "Hotel not found" });
              }

              // Get available rooms

              const rooms = await Room.find({
                hotel: hotel._id,
                status: true,
              });

              res.status(200).json({
                ...hotel.toObject(),
                rooms,
              });
            }catch(error) {
              res.status(500).json({ message: error.message });
            }
};


exports.toggleHotelStatus = async (req, res) => {

  try {

    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {

      return res.status(404).json({ message: "Hotel not found" });
    }

    hotel.isActive = !hotel.isActive;
    await hotel.save();

    res.json({
      message: "Hotel status updated",
      hotel,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });

  }
};




// UPDATE HOTEL
exports.updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Ownership check
    if (
      hotel.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "masterAdmin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedHotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE HOTEL
exports.deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Ownership check
    if (
      hotel.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "masterAdmin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    // STEP 1: delete all rooms of this hotel
    await Room.deleteMany({ hotel: hotel._id });

    // STEP 2: delete hotel
    await hotel.deleteOne();

    res.json({ message: "Hotel and its rooms deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};