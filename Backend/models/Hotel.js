
const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: [{
      type: String,
    }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // New fields added
    amenities: [
      {
        type: String,
        enum: [
          "WiFi",
          "AC",
          "Pool",
          "Restaurant",
          "Bar",
          "Minibar",
          "Parking",
          "Gym",
          "Spa",
          "Welcome Drink",
          "Beach Access",
          "Kitchen",
          "Room Service",
          "Business Center",
          "Fireplace",
          "Balcony",
        ],
      },
    ],
    rating: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    rooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hotel", hotelSchema);