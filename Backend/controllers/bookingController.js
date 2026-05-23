const Booking = require("../models/Booking");
const Room = require("../models/Room");
const Hotel = require("../models/Hotel");
const sendEmail = require("../utils/sendEmail");

/*
========================================
CHECK AVAILABILITY
========================================
*/
const checkAvailability = async (req, res) => {
  try {
    const { hotelId, checkIn, checkOut } = req.query;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (!hotelId || !checkIn || !checkOut) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ message: "Invalid date selection" });
    }

    const rooms = await Room.find({
      hotel: hotelId,
      status: true
    });

    const availableRooms = [];

    for (let room of rooms) {

      const overlappingBookings = await Booking.countDocuments({
        room: room._id,
        status: { $ne: "cancelled" },
        checkIn: { $lt: checkOutDate },
        checkOut: { $gt: checkInDate }
      });

      const availableCount = room.totalRooms - overlappingBookings;

      if (availableCount > 0) {
        availableRooms.push({
          ...room._doc,
          availableRooms: availableCount
        });
      }
    }

    res.json(availableRooms);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/*
========================================
CREATE BOOKING
========================================
*/
const createBooking = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut, guests } = req.body;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ message: "Invalid dates" });
    }

    const room = await Room.findById(roomId);

    if (!room || !room.status) {
      return res.status(404).json({ message: "Room not available" });
    }

    const overlappingBookings = await Booking.countDocuments({
      room: roomId,
      status: { $ne: "cancelled" },
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate }
    });

    const availableCount = room.totalRooms - overlappingBookings;

    if (availableCount <= 0) {
      return res.status(400).json({ message: "Room fully booked" });
    }

    const nights = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);
    const totalPrice = nights * room.pricePerNight;

    const booking = await Booking.create({
      user: req.user._id,
      hotel: room.hotel,
      room: roomId,
      checkIn,
      checkOut,
      guests,
      totalPrice,
      status: "pending"
    });


    res.status(201).json({
      message: "Booking created successfully",
      booking
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


  const confirmBooking = async (req, res) => {
  try {

    const booking = await Booking.findById(req.params.id)
      .populate("user")
      .populate("hotel")
      .populate("room");

      console.log("Booking debug:", booking);
      console.log("user debug:", booking?.user);
      console.log("user email debug:",booking?.user?.email);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.status !== "pending") {
      return res.status(400).json({ message: "Booking already confirmed" });
    }

    // Send confirmation email

  await sendEmail({

  to: booking.user.email,

  subject: "StayNest - Booking Confirmed (Awaiting Payment)",

  html: `

  <div style="font-family: Arial, sans-serif; background-color:#f4f6f9; padding:30px;">

    <div style="max-width:600px; margin:auto; background:#ffffff; padding:25px; border-radius:8px; box-shadow:0 4px 10px rgba(0,0,0,0.05);">

      <h2 style="color:#2c3e50; text-align:center;">🏨 Booking Confirmed</h2>

      <p style="font-size:14px; color:#555;">

        Great news! Your booking at <strong>${booking.hotel.name}</strong> has been successfully confirmed.

        Please complete your payment to secure your reservation.

      </p>

      <hr style="margin:20px 0;" />

      <h3 style="color:#34495e;">📄 Booking Details</h3>

      <table style="width:100%; font-size:14px; color:#555;">

        <tr>

          <td><strong>Hotel:</strong></td>

          <td>${booking.hotel.name}</td>

        </tr>

        <tr>

          <td><strong>Location:</strong></td>

          <td>${booking.hotel.location}</td>

        </tr>

        <tr>

          <td><strong>Room Type:</strong></td>

          <td>${booking.room.roomType}</td>

        </tr>

        <tr>

          <td><strong>Check-in:</strong></td>

          <td>${new Date(booking.checkIn).toDateString()}</td>

        </tr>

        <tr>

          <td><strong>Check-out:</strong></td>

          <td>${new Date(booking.checkOut).toDateString()}</td>

        </tr>

        <tr>

          <td><strong>Total Price:</strong></td>

          <td>₹${booking.totalPrice}</td>

        </tr>

        <tr>

          <td><strong>Status:</strong></td>

          <td style="color:orange;">Pending Payment</td>

        </tr>

      </table>

      <div style="margin-top:25px; text-align:center;">

        <p style="font-size:13px; color:#777;">

          Please log in to your StayNest account to complete the payment.

        </p>

      </div>

      <hr style="margin:25px 0;" />

      <p style="font-size:12px; color:#999; text-align:center;">

        Thank you for choosing <strong>StayNest</strong>.<br/>

        We look forward to hosting you!

      </p>

    </div>

  </div>
  `
});

    res.json({ message: "Confirmation email sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/*
========================================
GET MY BOOKINGS
========================================
*/
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user._id
    })
      .populate("hotel", "name location images")
      .populate("room", "roomType");

  

    res.json(bookings);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/*
========================================
CANCEL BOOKING
========================================
*/
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only booking owner can cancel
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    // If already cancelled
    if (booking.status === "cancelled") {
      return res.status(400).json({
        message: "Booking already cancelled",
      });
    }

    // If paid → mark refund pending
    if (booking.status === "paid") {
      booking.status = "cancelled";
      booking.refundStatus = "pending";
    }else{
      booking.status = "cancelled";
    }
      await booking.save();

      const populatedbooking = await Booking.findById(booking._id)

        .populate("hotel", "name location images")
        .populate("room", "roomType");

      return res.json({
        message:
          booking.status === "paid" ? "Booking cancelled." : "Book cancelled Successfully",
          booking: populatedbooking,
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
---------------------------------------
PAY BOOKING (Simulation)
---------------------------------------
User marks booking as confirmed
*/
const payBooking = async (req, res) => {

  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user")
      .populate("hotel");

      console.log("Booking debug:", booking);
      console.log("user debug:", booking?.user);
      console.log("user email debug:",booking?.user?.email);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if(!booking.user || !booking.user.email){
      return res.status(400).json({message: "user email not found"});
    }

    const paymentId = "PAY" + Date.now();
    booking.status = "paid";
    booking.paymentId = paymentId;
    booking.paidAt = new Date();
    await booking.save();

    // Send payment email

await sendEmail({

  to: booking.user.email,

  subject: "StayNest - Payment Successful",

  html: `

  <div style="font-family: Arial, sans-serif; background-color:#f4f6f9; padding:30px;">

    <div style="max-width:600px; margin:auto; background:#ffffff; padding:25px; border-radius:8px; box-shadow:0 4px 10px rgba(0,0,0,0.05);">

      <h2 style="color:#27ae60; text-align:center;">✅ Payment Successful</h2>

      <p style="font-size:14px; color:#555;">

        Your payment has been successfully processed. Your reservation is now fully confirmed.

      </p>

      <hr style="margin:20px 0;" />

      <h3 style="color:#34495e;">📄 Booking Summary</h3>

      <table style="width:100%; font-size:14px; color:#555;">

        <tr>

          <td><strong>Hotel:</strong></td>

          <td>${booking.hotel.name}</td>

        </tr>

        <tr>

          <td><strong>Location:</strong></td>

          <td>${booking.hotel.location}</td>

        </tr>

        <tr>

          <td><strong>Check-in:</strong></td>

          <td>${new Date(booking.checkIn).toDateString()}</td>

        </tr>

        <tr>

          <td><strong>Check-out:</strong></td>

          <td>${new Date(booking.checkOut).toDateString()}</td>

        </tr>

        <tr>

          <td><strong>Total Paid:</strong></td>

          <td>₹${booking.totalPrice}</td>

        </tr>

        <tr>

          <td><strong>Payment ID:</strong></td>

          <td>${paymentId}</td>

        </tr>

        <tr>

          <td><strong>Status:</strong></td>

          <td style="color:green;">Confirmed</td>

        </tr>

      </table>

      <hr style="margin:25px 0;" />

      <p style="font-size:13px; color:#777;">

        Please keep this email for your records.

      </p>

      <p style="font-size:12px; color:#999; text-align:center; margin-top:20px;">

        Thank you for booking with <strong>StayNest</strong>.<br/>

        We wish you a pleasant stay!

      </p>

    </div>

  </div>

  `

});
    res.json({ message: "Payment successful", booking });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ message: error.message });
  }
};




/*
---------------------------------------
REFUND BOOKING
---------------------------------------
*/

const refundBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.refundStatus !== "pending") {
      return res.status(400).json({
        message: "No pending refund for this booking",
      });
    }

    booking.refundStatus = "refunded";
    booking.refundedAt = new Date();
    await booking.save();

    res.json({
      message: "Refund processed successfully",
      booking,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  checkAvailability,
  createBooking,
  confirmBooking,
  getMyBookings,
  cancelBooking,
  payBooking,
  refundBooking
};