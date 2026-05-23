import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Users, CreditCard, X } from "lucide-react";
import { useAppContext } from "@/app/context/AppContext";
import Button from "@/app/components/Button";
import Card from "@/app/components/Card";
import axios from "axios";

export default function MyBookingsPage() {
  const {
    bookings,
    currentUser,
    authLoading,
    addBooking,
    updateBookingStatus,
    cancelBooking,
  } = useAppContext();
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate("/login");
    }
  }, [authLoading, currentUser, navigate]);

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return null;
  }

  const userBookings = bookings.filter(
    (b) => b.userId === currentUser._id && b.hotel,
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-success/10 text-success border-success/30";
      case "pending":
        return "bg-warning/10 text-warning border-warning/30";
      case "cancelled":
        return "bg-error/10 text-error border-error/30";
      default:
        return "bg-section-bg text-text-secondary border-border";
    }
  };

  const handlePayment = async (booking) => {
    try {
      axios.put(
        `https://online-room-booking-system.onrender.com/api/bookings/${booking._id}/confirm`,
        {},
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        },
      );
      navigate(`/payment/${booking._id}`, { state: { booking } });
    } catch (error) {
      alert("Error sending confirmation email");
    }
  };

  const handleCancelClick = (bookingId) => {
    setSelectedBookingId(bookingId);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    if (selectedBookingId) {
      cancelBooking(selectedBookingId);
      setShowCancelModal(false);
      setSelectedBookingId(null);
    }
  };

  const handleCancelModalClose = () => {
    setShowCancelModal(false);
    setSelectedBookingId(null);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold mb-8">My Bookings</h1>

        {userBookings.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-text-secondary mb-4">
              You haven't made any bookings yet.
            </p>
            <Button onClick={() => navigate("/hotels")}>Browse Hotels</Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {userBookings.map((booking) => (
              <Card
                key={booking._id}
                className="hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Hotel Image */}
                  <div className="w-full md:w-48 h-48 flex-shrink-0">
                    <img
                      src={
                        booking.hotel?.images?.[0]
                          ? `https://online-room-booking-system.onrender.com/${booking.hotel.images[0]}`
                          : ""
                      }
                      alt={booking.hotel?.name}
                      className="w-full md:w-48 h-48 bg-cover rounded-lg"
                    />
                  </div>
                  {/* Booking Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          {booking.hotel?.name}
                        </h3>
                        <p className="text-text-secondary">
                          {booking.room?.roomType}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                          booking.status,
                        )}`}
                      >
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <Calendar className="w-4 h-4" />
                        <div>
                          <p className="font-medium text-text-primary">
                            Check-in
                          </p>
                          <p>
                            {new Date(booking.checkIn).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <Calendar className="w-4 h-4" />
                        <div>
                          <p className="font-medium text-text-primary">
                            Check-out
                          </p>
                          <p>
                            {new Date(booking.checkOut).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <Users className="w-4 h-4" />
                        <div>
                          <p className="font-medium text-text-primary">
                            Guests
                          </p>
                          <p>
                            {booking.guests}{" "}
                            {booking.guests === 1 ? "guest" : "guests"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between pt-4 border-t border-border gap-4">
                      <div>
                        <p className="text-sm text-text-muted">Total Amount</p>
                        <p className="text-2xl font-semibold text-primary">
                          ₹{booking.totalPrice.toLocaleString("en-IN")}
                        </p>
                      </div>

                      <div className="flex gap-3">
                        {booking.status === "pending" && (
                          <>
                            <Button
                              variant="primary"
                              onClick={() => handlePayment(booking)}
                            >
                              <CreditCard className="w-4 h-4 mr-2" />
                              Pay Now
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleCancelClick(booking._id)}
                              className="border-error text-error hover:bg-error/10"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Cancel
                            </Button>
                          </>
                        )}

                        {booking.status === "paid" && (
                          <div className="text-right">
                            <p className="text-sm text-success font-medium">
                              Payment Confirmed
                            </p>
                            <p className="text-xs text-text-muted">
                              Booking ID: {booking._id}
                            </p>
                          </div>
                        )}

                        {booking.status === "cancelled" && (
                          <div className="text-right">
                            <p className="text-sm text-error font-medium">
                              Booking Cancelled
                            </p>
                            <p className="text-xs text-text-muted">
                              This booking has been cancelled
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Cancel Booking?</h3>
              <p className="text-text-secondary">
                Are you sure you want to cancel this booking? This action cannot
                be undone.
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={handleCancelModalClose}>
                No, Keep Booking
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmCancel}
                className="bg-error hover:bg-error/90"
              >
                Yes, Cancel Booking
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
