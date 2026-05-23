import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  CreditCard,
  Lock,
  CheckCircle,
  Smartphone,
  Building2,
  Shield,
} from "lucide-react";
import { useAppContext } from "@/app/context/AppContext";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import Card from "@/app/components/Card";
import axios from "axios";

export default function PaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { payBooking, updateBookingStatus, currentUser, bookings } =
    useAppContext();

  // Try to get booking from location state or find it in bookings
  let booking = location.state?.booking;

  if (!booking && id) {
    booking = bookings.find((b) => b._id === id);
  }

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    upiId: "",
    bank: "",
  });

  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  const handleChange = (field, value) => {
    setPaymentForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const response = await axios.patch(
        `http://localhost:5000/api/bookings/${booking._id}/pay`,
        {},

        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        },
      );

      updateBookingStatus(booking._id, "paid");

      setSuccess(true);
      setTimeout(() => {
        navigate("/bookings");
      }, 1500);
    } catch (error) {
      console.log("Payment error:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Payment failed");
    }
    setProcessing(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="text-center max-w-md">
          <div className="mb-6">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-success" />
            </div>
            <h2 className="text-3xl font-semibold mb-2">Payment Successful!</h2>
            <p className="text-text-secondary">
              Your booking has been confirmed. A confirmation email has been
              sent to your inbox.
            </p>
          </div>

          {booking && (
            <div className="bg-section-bg p-4 rounded-lg mb-6 text-left">
              <p className="text-sm text-text-muted mb-2">Booking Details</p>
              <p className="font-semibold mb-1">{booking.hotel?.name}</p>
              <p className="text-sm text-text-secondary mb-2">
                {booking.room?.roomType}
              </p>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Total Paid</span>
                <span className="font-semibold text-primary">
                  ₹{booking.totalPrice.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          )}

          <p className="text-sm text-text-muted">
            Redirecting to your bookings...
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-section-bg py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-6 h-6 text-success" />
            <h1 className="text-3xl font-semibold">Secure Payment</h1>
          </div>
          <p className="text-text-secondary">
            Complete your booking with confidence
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
                <Lock className="w-5 h-5 text-success" />
                <h2 className="text-xl font-semibold">Payment Information</h2>
              </div>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <label className="block font-medium mb-3">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${
                      paymentMethod === "card"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <CreditCard className="w-6 h-6" />
                    <span className="text-sm font-medium">Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("upi")}
                    className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${
                      paymentMethod === "upi"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Smartphone className="w-6 h-6" />
                    <span className="text-sm font-medium">UPI</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("netbanking")}
                    className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${
                      paymentMethod === "netbanking"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Building2 className="w-6 h-6" />
                    <span className="text-sm font-medium">Net Banking</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Card Payment */}
                {paymentMethod === "card" && (
                  <>
                    <Input
                      label="Card Number"
                      type="text"
                      value={paymentForm.cardNumber}
                      onChange={(e) =>
                        handleChange("cardNumber", e.target.value)
                      }
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      required
                    />

                    <Input
                      label="Cardholder Name"
                      type="text"
                      value={paymentForm.cardName}
                      onChange={(e) => handleChange("cardName", e.target.value)}
                      placeholder="John Doe"
                      required
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Expiry Date"
                        type="text"
                        value={paymentForm.expiryDate}
                        onChange={(e) =>
                          handleChange("expiryDate", e.target.value)
                        }
                        placeholder="MM/YY"
                        maxLength="5"
                        required
                      />

                      <Input
                        label="CVV"
                        type="text"
                        value={paymentForm.cvv}
                        onChange={(e) => handleChange("cvv", e.target.value)}
                        placeholder="123"
                        maxLength="3"
                        required
                      />
                    </div>
                  </>
                )}

                {/* UPI Payment */}
                {paymentMethod === "upi" && (
                  <Input
                    label="UPI ID"
                    type="text"
                    value={paymentForm.upiId}
                    onChange={(e) => handleChange("upiId", e.target.value)}
                    placeholder="username@upi"
                    required
                  />
                )}

                {/* Net Banking */}
                {paymentMethod === "netbanking" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Select Bank
                    </label>
                    <select
                      value={paymentForm.bank}
                      onChange={(e) => handleChange("bank", e.target.value)}
                      className="w-full h-11 px-4 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    >
                      <option value="">Choose your bank...</option>
                      <option value="sbi">State Bank of India</option>
                      <option value="hdfc">HDFC Bank</option>
                      <option value="icici">ICICI Bank</option>
                      <option value="axis">Axis Bank</option>
                      <option value="pnb">Punjab National Bank</option>
                      <option value="kotak">Kotak Mahindra Bank</option>
                    </select>
                  </div>
                )}

                {error && (
                  <div className="bg-error/10 border border-error/30 rounded-lg p-4 text-sm text-error">
                    {error}
                  </div>
                )}

                <div className="bg-info/10 border border-info/30 rounded-lg p-4 text-sm">
                  <p className="text-info flex items-start gap-2">
                    <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Demo Payment:</strong> This is a demonstration.
                      Use any payment details to complete the transaction. No
                      actual payment will be processed.
                    </span>
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={processing}
                >
                  <Lock className="w-5 h-5 mr-2" />
                  {processing
                    ? "Processing..."
                    : booking
                      ? `Pay ₹${booking.totalPrice.toLocaleString("en-IN")}`
                      : "Pay Now"}
                </Button>
              </form>
            </Card>

            {/* Security Features */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Lock className="w-6 h-6 text-success" />
                </div>
                <p className="text-xs text-text-secondary">SSL Secured</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-6 h-6 text-success" />
                </div>
                <p className="text-xs text-text-secondary">PCI Compliant</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                <p className="text-xs text-text-secondary">100% Safe</p>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            {booking ? (
              <Card className="sticky top-20">
                <h3 className="text-lg font-semibold mb-4 pb-4 border-b border-border">
                  Booking Summary
                </h3>

                <div
                  className="h-32 bg-cover bg-center rounded-lg mb-4"
                  style={{
                    backgroundImage: booking.hotel?.images?.[0]
                      ? `url(http://localhost:5000/${booking.hotel.images[0]})`
                      : "none",
                  }}
                />

                <h4 className="font-semibold mb-1">{booking.hotelName}</h4>
                <p className="text-sm text-text-secondary mb-4">
                  {booking.roomType}
                </p>

                <div className="space-y-3 mb-4 pb-4 border-b border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Check-in</span>
                    <span>
                      {new Date(booking.checkIn).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Check-out</span>
                    <span>
                      {new Date(booking.checkOut).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Guests</span>
                    <span>{booking.guests}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Price per night</span>
                    <span>₹{booking.totalPrice.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div className="bg-primary/5 p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Amount</span>
                    <span className="text-2xl font-bold text-primary">
                      ₹{booking.totalPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="bg-success/10 border border-success/30 rounded-lg p-3 text-xs text-success">
                  <CheckCircle className="w-4 h-4 inline mr-1" />
                  Free cancellation within 24 hours
                </div>
              </Card>
            ) : (
              <Card className="sticky top-20">
                <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
                <p className="text-text-secondary text-sm">
                  Complete the payment form to proceed with your booking.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
