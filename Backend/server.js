
const cors = require("cors");
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { protect } = require("./middleware/authMiddleware");
const authorizeRoles = require("./middleware/roleMiddleware");

const hotelRoutes = require("./routes/hotelRoutes");
const adminRoutes = require("./routes/adminRoutes");
const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");




dotenv.config();
connectDB();

const app = express();

/* ==============================
   ✅ CORS CONFIGURATION (IMPORTANT)
================================= */
app.use(
  cors({
    origin: "http://localhost:5173", // React frontend
    credentials: true,
  })
);

/* ==============================
   MIDDLEWARE
================================= */
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname,"uploads")));

/* ==============================
   ROUTES
================================= */
app.use("/api/auth", authRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/contact",contactRoutes);
app.use("/api/newsletter", newsletterRoutes);

/* ==============================
   TEST ROUTES
================================= */

// Public test
app.get("/", (req, res) => {
  res.send("Server Running");
});

// Protected test
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "You accessed protected route",
    user: req.user,
  });
});

// Admin-only test
app.get(
  "/api/admin-only",
  protect,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({
      message: "Welcome Admin",
    });
  }
);

/* ==============================
   START SERVER
================================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});