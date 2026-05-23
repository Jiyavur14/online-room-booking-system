import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [hotels, setHotels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [adminRequests, setAdminRequests] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [searchParams, setSearchParams] = useState({
    city: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
  });

  const fetchHotels = async () => {
    try {
      const config = currentUser?.token
        ? { headers: { Authorization: `Bearer ${currentUser.token}` } }
        : {};

      const response = await axios.get(
        "https://online-room-booking-system.onrender.com/api/hotels",

        config,
      );

      setHotels(response.data);
    } catch (error) {
      console.error("Failed to fetch hotels:", error);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [currentUser]);

  const fetchMyBookings = async () => {
    try {
      const response = await axios.get(
        "https://online-room-booking-system.onrender.com/api/bookings/my-bookings",
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        },
      );
      setBookings(response.data); // Backend returns array of bookings
    } catch (error) {
      console.error(
        "Error fetching bookings:",
        error.response?.data || error.message,
      );
    }
  };

  const register = async (email, password) => {
    const res = await axios.post(
      "https://online-room-booking-system.onrender.com/api/auth/register",
      {
        email,
        password,
      },
    );

    return res.data;
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "https://online-room-booking-system.onrender.com/api/auth/login",
        {
          email,
          password,
        },
      );

      const data = response.data;

      const user = {
        id: data._id,
        email: data.email,
        role: data.role,
        /*name: data.name,*/
        token: data.token,
      };

      setCurrentUser(user);
      localStorage.setItem("user", JSON.stringify(user));

      return user;
    } catch (error) {
      throw new Error("Login failed");
    }
  };

  const logout = () => {
    setCurrentUser(null);
    //  setHotels([]);
    setBookings([]);
    localStorage.removeItem("user");
  };

  const addBooking = async ({ roomId, checkIn, checkOut, guests }) => {
    try {
      await axios.post(
        "https://online-room-booking-system.onrender.com/api/bookings",
        { roomId, checkIn, checkOut, guests },

        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        },
      );

      await fetchMyBookings();
      // The backend returns the created booking
      //const newBooking = response.data.booking;
      // Update local state
      //return newBooking;
    } catch (error) {
      console.error(
        "Error creating booking:",
        error.response?.data || error.message,
      );
      throw error;
    }
  };

  const payBooking = async (bookingId) => {
    try {
      const response = await axios.patch(
        `https://online-room-booking-system.onrender.com/api/bookings/${bookingId}/pay`,
        {},
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        },
      );

      // Update booking in local state

      const updatedBooking = response.data.booking;

      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? updatedBooking : b)),
      );
      return updatedBooking;
    } catch (error) {
      console.error(
        "Error paying booking:",
        error.response?.data || error.message,
      );
      throw error;
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      const response = await axios.patch(
        `https://online-room-booking-system.onrender.com/api/bookings/${bookingId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        },
      );

      const updatedBooking = response.data.booking;

      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? updatedBooking : b)),
      );
      return updatedBooking;
    } catch (error) {
      console.error(
        "Error cancelling booking:",
        error.response?.data || error.message,
      );
      throw error;
    }
  };

  const updateBookingStatus = (bookingId, newStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b)),
    );
  };

  const addHotel = async (formData) => {
    try {
      // Call backend API
      const response = await axios.post(
        "https://online-room-booking-system.onrender.com/api/hotels",
        formData,
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      // Add the returned hotel to state
      setHotels((prev) => [...prev, response.data.hotel]);
      return response.data.hotel;
    } catch (error) {
      console.error("Error adding hotel:", error);
      throw error;
    }
  };

  const addRoom = async (roomData) => {
    try {
      /*const token = localStorage.getItem("token");*/

      const response = await axios.post(
        "https://online-room-booking-system.onrender.com/api/rooms",
        roomData,
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
            "Content-Type": "application/json",
          },
        },
      );

      return response.data;

      // Optional: update local state
      setRooms((prev) => [...prev, response.data.room]);
    } catch (error) {
      console.error(
        "Error adding room:",
        error.response?.data || error.message,
      );
    }
  };

  const getHotels = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      // if needed for admin routes
      const token = user?.token;
      const response = await axios.get(
        "https://online-room-booking-system.onrender.com/api/hotels",
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching hotels:", error);
      return [];
    }
  };

  const getHotelById = async (id) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;
      const response = await axios.get(
        `https://online-room-booking-system.onrender.com/api/hotels/${id}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching hotel:", error);
      return null;
    }
  };

  const checkRoomAvailability = async (hotelId, checkIn, checkOut) => {
    try {
      const response = await axios.get(
        "https://online-room-booking-system.onrender.com/api/bookings/availability",

        {
          params: { hotelId, checkIn, checkOut },
        },
      );

      return response.data; // this returns rooms with availableRooms field
    } catch (error) {
      console.error("Error checking availability:", error);

      return [];
    }
  };

  const getAdminDashboard = async (showAll = false) => {
    try {
      const url = showAll
        ? "https://online-room-booking-system.onrender.com/api/admin/dashboard?all=true"
        : "https://online-room-booking-system.onrender.com/api/admin/dashboard";

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching admin dashboard:", error);
      return null;
    }
  };

  const getAdminRooms = async () => {
    try {
      const response = await axios.get(
        "https://online-room-booking-system.onrender.com/api/rooms/admin",

        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching admin rooms:", error);

      return [];
    }
  };

  const toggleRoomStatus = async (roomId) => {
    try {
      await axios.patch(
        `https://online-room-booking-system.onrender.com/api/rooms/${roomId}/toggle-status`,

        {},

        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        },
      );
    } catch (error) {
      console.error("Error toggling room:", error);
    }
  };

  const toggleRoomAvailability = (hotelId, roomId) => {
    setHotels((prev) =>
      prev.map((h) =>
        h.id === hotelId
          ? {
              ...h,
              rooms: h.rooms.map((r) =>
                r.id === roomId
                  ? { ...r, available: r.available > 0 ? 0 : 5 }
                  : r,
              ),
            }
          : h,
      ),
    );
  };

  const getAllUsers = async () => {
    const res = await axios.get(
      "https://online-room-booking-system.onrender.com/api/admin/users",

      {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      },
    );

    return res.data;
  };

  const promoteUser = async (id) => {
    await axios.patch(
      `https://online-room-booking-system.onrender.com/api/admin/promote/${id}`,
      {},

      { headers: { Authorization: `Bearer ${currentUser.token}` } },
    );
  };

  const demoteUser = async (id) => {
    await axios.patch(
      `https://online-room-booking-system.onrender.com/api/admin/demote/${id}`,
      {},

      { headers: { Authorization: `Bearer ${currentUser.token}` } },
    );
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(
        `https://online-room-booking-system.onrender.com/api/admin/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        },
      );
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const toggleHotelStatus = async (id) => {
    await axios.patch(
      `https://online-room-booking-system.onrender.com/api/hotels/toggle/${id}`,
      {},

      { headers: { Authorization: `Bearer ${currentUser.token}` } },
    );
  };

  // Super Admin Functions
  const approveAdminRequest = (requestId) => {
    const request = adminRequests.find((req) => req.id === requestId);
    if (!request) return;

    // Generate unique hotel ID
    const hotelId = "hotel_" + Date.now();

    // Create new hotel
    const newHotel = {
      id: hotelId,
      name: request.hotelName,
      city: request.city,
      description:
        request.description || `${request.hotelName} in ${request.city}`,
      images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945"],
      amenities: ["WiFi", "Restaurant", "Parking"],
      rating: 0,
      rooms: [],
    };

    // Create new admin user
    const newAdmin = {
      id: "admin_" + Date.now(),
      name: request.name,
      email: request.email,
      hotelId: hotelId,
      hotelName: request.hotelName,
      role: "admin",
      isActive: true,
    };

    // Update state
    setHotels((prev) => [...prev, newHotel]);
    setAdmins((prev) => [...prev, newAdmin]);
    setAdminRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: "approved",
              approvedDate: new Date().toISOString(),
            }
          : req,
      ),
    );
  };

  const rejectAdminRequest = (requestId) => {
    setAdminRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: "rejected",
              rejectedDate: new Date().toISOString(),
            }
          : req,
      ),
    );
  };

  const toggleAdminStatus = (adminId) => {
    setAdmins((prev) =>
      prev.map((admin) =>
        admin.id === adminId ? { ...admin, isActive: !admin.isActive } : admin,
      ),
    );
  };

  const deleteHotel = async (hotelId) => {
    try {
      await axios.delete(
        `https://online-room-booking-system.onrender.com/api/hotels/${hotelId}`,
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        },
      );

      // Remove from UI after successful deletion
      setHotels((prev) => prev.filter((h) => h._id !== hotelId));
    } catch (error) {
      console.error("Error deleting hotel:", error);
    }
  };

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    setAuthLoading(false);
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchMyBookings();
    }
  }, [currentUser]);

  const value = {
    currentUser,
    authLoading,
    hotels,
    bookings,
    adminRequests,
    admins,
    searchParams,
    setSearchParams,
    login,
    register,
    logout,
    addBooking,
    payBooking,
    cancelBooking,
    updateBookingStatus,
    addHotel,
    addRoom,
    getHotels,
    getHotelById,
    checkRoomAvailability,
    getAdminDashboard,
    getAdminRooms,
    toggleRoomStatus,
    toggleRoomAvailability,
    getAllUsers,
    promoteUser,
    demoteUser,
    deleteUser,
    toggleHotelStatus,
    approveAdminRequest,
    rejectAdminRequest,
    toggleAdminStatus,
    deleteHotel,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
