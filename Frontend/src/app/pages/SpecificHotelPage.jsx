import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Star, Wifi, Calendar, Users, Check } from "lucide-react";
import { useAppContext } from "@/app/context/AppContext";
import Button from "@/app/components/Button";
import Card from "@/app/components/Card";
import Input from "@/app/components/Input";

export default function SpecificHotelPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getHotelById,
    currentUser,
    addBooking,
    searchParams,
    checkRoomAvailability,
  } = useAppContext();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotel = async () => {
      const data = await getHotelById(id);

      // ✅ Map rooms to add availableRooms = totalRooms initially
      const roomsWithAvailability = data.rooms.map((room) => ({
        ...room,
        availableRooms: room.totalRooms || 0,
      }));

      setHotel({
        ...data,
        rooms: roomsWithAvailability,
      });

      setLoading(false);
    };

    fetchHotel();
  }, [id]);

  const [bookingForm, setBookingForm] = useState({
    checkIn: searchParams.checkIn || "",
    checkOut: searchParams.checkOut || "",
    guests: searchParams.guests || 1,
    selectedRoom: null,
  });

  const [showAvailability, setShowAvailability] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Hotel Not Found</h2>
          <Button onClick={() => navigate("/hotels")}>Browse Hotels</Button>
        </Card>
      </div>
    );
  }

  const handleCheckAvailability = async () => {
    if (!bookingForm.checkIn || !bookingForm.checkOut) {
      alert("Please select dates");

      return;
    }

    const availableRooms = await checkRoomAvailability(
      hotel._id,

      bookingForm.checkIn,

      bookingForm.checkOut,
    );

    // Update hotel rooms with availableRooms

    setHotel((prev) => ({
      ...prev,

      rooms: availableRooms,
    }));

    setShowAvailability(true);
  };

  const handleBookNow = (room) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (!bookingForm.checkIn || !bookingForm.checkOut) {
      alert("Please select dates");
      return;
    }

    const booking = {
      hotelId: hotel._id,
      hotelName: hotel.name,
      hotelImage: hotel.images[0],
      roomId: room._id,
      roomType: room.roomType,
      price: room.pricePerNight,
      checkIn: bookingForm.checkIn,
      checkOut: bookingForm.checkOut,
      guests: bookingForm.guests,
      totalAmount: calculateTotalAmount(room.pricePerNight),
    };

    addBooking(booking);
    navigate("/bookings");
  };

  const calculateTotalAmount = (pricePerNight) => {
    if (!bookingForm.checkIn || !bookingForm.checkOut) return 0;
    const start = new Date(bookingForm.checkIn);
    const end = new Date(bookingForm.checkOut);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return pricePerNight * nights;
  };

  const calculateNights = () => {
    if (!bookingForm.checkIn || !bookingForm.checkOut) return 0;
    const start = new Date(bookingForm.checkIn);
    const end = new Date(bookingForm.checkOut);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image */}
      <div
        className="h-96 bg-cover bg-center"
        style={{
          backgroundImage: `url(http://localhost:5000/${hotel.images[0]})`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Hotel Info */}
            <Card className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-semibold mb-2">{hotel.name}</h1>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-accent">
                      <Star className="w-5 h-5 fill-current" />
                      <span className="font-medium">{hotel.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-text-secondary">
                      <MapPin className="w-5 h-5" />
                      <span>{hotel.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-text-secondary mb-6">{hotel.description}</p>

              {/* Amenities */}
              <div>
                <h3 className="font-semibold mb-4">Hotel Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {hotel.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success" />
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Room Selection */}
            <Card>
              <h2 className="text-2xl font-semibold mb-6">Available Rooms</h2>

              {showAvailability && calculateNights() > 0 && (
                <div className="bg-section-bg p-4 rounded-lg mb-6">
                  <p className="text-sm text-text-secondary">
                    Showing availability for {calculateNights()}{" "}
                    {calculateNights() === 1 ? "night" : "nights"}(
                    {new Date(bookingForm.checkIn).toLocaleDateString()} -{" "}
                    {new Date(bookingForm.checkOut).toLocaleDateString()})
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {hotel.rooms.map((room) => (
                  <div
                    key={room._id}
                    className="flex flex-col md:flex-row gap-6 p-6 border border-border rounded-lg hover:border-primary transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">
                        {room.roomType}
                      </h3>
                      <div className="flex flex-wrap gap-3 mb-4">
                        {room.amenities.map((amenity) => (
                          <span
                            key={amenity}
                            className="flex items-center gap-1 text-sm text-text-secondary"
                          >
                            <Check className="w-4 h-4 text-success" />
                            {amenity}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {room.availableRooms > 0 ? (
                          <span className="text-success font-medium">
                            {room.availableRooms} rooms available
                          </span>
                        ) : (
                          <span className="text-error font-medium">
                            No rooms available
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex md:flex-col justify-between md:justify-start items-end gap-4 md:w-48">
                      <div className="text-right">
                        <p className="text-3xl font-semibold text-primary mb-1">
                          ₹{room.pricePerNight.toLocaleString("en-IN")}
                        </p>
                        <p className="text-sm text-text-muted">per night</p>
                        {showAvailability && calculateNights() > 0 && (
                          <p className="text-sm text-text-secondary mt-2">
                            Total: ₹
                            {calculateTotalAmount(
                              room.pricePerNight,
                            ).toLocaleString("en-IN")}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="primary"
                        disabled={
                          !room.availableRooms || room.availableRooms === 0
                        }
                        onClick={() => handleBookNow(room)}
                        className="w-full md:w-auto"
                      >
                        {room.available === 0 ? "Unavailable" : "Book Now"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <aside className="lg:w-96 flex-shrink-0">
            <Card className="sticky top-20">
              <h3 className="text-xl font-semibold mb-6">Check Availability</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Check-in
                  </label>
                  <input
                    type="date"
                    value={bookingForm.checkIn}
                    onChange={(e) =>
                      setBookingForm((prev) => ({
                        ...prev,
                        checkIn: e.target.value,
                      }))
                    }
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full h-11 px-4 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Check-out
                  </label>
                  <input
                    type="date"
                    value={bookingForm.checkOut}
                    onChange={(e) =>
                      setBookingForm((prev) => ({
                        ...prev,
                        checkOut: e.target.value,
                      }))
                    }
                    min={
                      bookingForm.checkIn ||
                      new Date().toISOString().split("T")[0]
                    }
                    className="w-full h-11 px-4 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Users className="inline w-4 h-4 mr-1" />
                    Guests
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={bookingForm.guests}
                    onChange={(e) =>
                      setBookingForm((prev) => ({
                        ...prev,
                        guests: parseInt(e.target.value) || 1,
                      }))
                    }
                    className="w-full h-11 px-4 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <Button
                variant="primary"
                className="w-full mb-4"
                onClick={handleCheckAvailability}
                disabled={!bookingForm.checkIn || !bookingForm.checkOut}
              >
                Check Availability
              </Button>

              {showAvailability && calculateNights() > 0 && (
                <div className="bg-section-bg p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-text-secondary">Nights</span>
                    <span className="text-sm font-medium">
                      {calculateNights()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-text-secondary">
                      Starting from
                    </span>
                    <span className="font-semibold text-primary">
                      ₹
                      {Math.min(
                        ...hotel.rooms.map(
                          (r) => r.pricePerNight * calculateNights(),
                        ),
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              )}
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
