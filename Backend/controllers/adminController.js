

const User = require("../models/User");
const Booking = require("../models/Booking");
const Hotel = require("../models/Hotel");
const Room = require("../models/Room");

/*
---------------------------------------
PROMOTE USER TO ADMIN
---------------------------------------
*/
exports.promoteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = "admin";
    await user.save();

    res.json({
      message: "User promoted to admin successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/*
---------------------------------------
DEMOTE ADMIN TO USER
---------------------------------------
*/
exports.demoteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = "user";
    await user.save();

    res.json({
      message: "Admin demoted to user successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/*
---------------------------------------
ADMIN DASHBOARD
---------------------------------------
Shows:
- Total Revenue
- Total Bookings
- Total Hotels
- Total Rooms
- Booking status stats
- Monthly revenue
- Recent bookings
---------------------------------------
*/
exports.getAdminDashboard = async (req, res) => {
  try {
    const adminId = req.user._id;

    // 1️⃣ Admin Hotels
    const adminHotels = await Hotel.find({
      createdBy: adminId,
    }).select("_id");

    const hotelIds = adminHotels.map(h => h._id);

    // 2️⃣ Total Hotels
    const totalHotels = hotelIds.length;

    // 3️⃣ Total Rooms
    const totalRooms = await Room.countDocuments({
      hotel: { $in: hotelIds },
    });

    // 4️⃣ Total Bookings
    const totalBookings = await Booking.countDocuments({
      hotel: { $in: hotelIds },
    });

    // 5️⃣ Total Revenue (paid only)
    const revenueData = await Booking.aggregate([
      {
        $match: {
          hotel: { $in: hotelIds },
          status: "paid",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
    ]);

    const totalRevenue =
      revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // 6️⃣ Booking Status Analytics
    const bookingStatusStats = await Booking.aggregate([
      {
        $match: {
          hotel: { $in: hotelIds },
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // 7️⃣ Monthly Revenue
    const monthlyRevenue = await Booking.aggregate([
      {
        $match: {
          hotel: { $in: hotelIds },
          status: "paid",
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    // 8️⃣ Recent Bookings
    // check if user wants all bookings
        const showAll = req.query.all === "true";

        let bookingQuery = Booking.find({
          hotel: { $in: hotelIds },
        })
          .populate("user", "name email")
          .populate("hotel", "name")
          .populate("room", "roomType")
          .sort({ createdAt: -1 });

        if (!showAll) {
          bookingQuery = bookingQuery.limit(5);
        }

        const recentBookings = await bookingQuery;

    res.json({
      stats: {
        totalRevenue,
        totalBookings,
        totalHotels,
        totalRooms,
      },
      bookingStatusStats,
      monthlyRevenue,
      recentBookings,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getAllUsers = async (req, res) => {

  try {

    const users = await User.find().select("email role");
    res.json(users);

  } catch (error) {
    res.status(500).json({ message: error.message });

  }
};


exports.getMasterDashboard = async (req, res) => {
  try {

    const totalRevenue = await Booking.aggregate([
      {
        $match: { status: "paid" }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" }
        }
      }
    ]);

    res.json({
      totalRevenue: totalRevenue[0]?.total || 0
    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};


exports.deleteUser = async (req, res) => {
  try {

    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent deleting master admin
    if (user.role === "masterAdmin") {
      return res.status(403).json({ message: "Cannot delete master admin" });
    }

    await User.findByIdAndDelete(userId);

    res.json({ message: "User deleted successfully" });

  } catch (error) {

    console.error(error);

    res.status(500).json({ message: "Server error" });

  }
};