const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    roomType: {
      type: String,
      enum: [
        "Single Room",
        "Double Room",
        "Twin Room",
        "Family Room",
        "Luxury Room",
        "Executive Room"
      ],
      required: true,
    },
    pricePerNight: {
      type: Number,
      required: true,
    },
    totalRooms: {
      type: Number,
      required: true,
    },
    amenities: {
      type: [String],
      default: [],
    },
    status: {
      type: Boolean,
      default: true, // true = available, false = disabled
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);