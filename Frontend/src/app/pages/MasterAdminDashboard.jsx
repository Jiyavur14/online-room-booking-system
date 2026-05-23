import { useEffect, useState } from "react";

import { Shield, Hotel, Users } from "lucide-react";

import { useAppContext } from "@/app/context/AppContext";

export default function MasterAdminDashboard() {
  const {
    currentUser,

    getAllUsers,

    promoteUser,

    demoteUser,

    toggleHotelStatus,

    getHotels,

    deleteHotel,

    deleteUser,
  } = useAppContext();

  const [totalRevenue, setTotalRevenue] = useState(0);

  const [hotels, setHotels] = useState([]);

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  // ================================

  // FETCH DASHBOARD DATA

  // ================================

  const fetchRevenue = async () => {
    try {
      const res = await fetch(
        "hhttps://online-room-booking-system.onrender.com/api/admin/master/dashboard",
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        },
      );

      const data = await res.json();

      setTotalRevenue(data.totalRevenue || 0);
    } catch (error) {
      console.error("Revenue fetch error:", error);
    }
  };

  const fetchHotelsData = async () => {
    const data = await getHotels();

    setHotels(data);
  };

  const fetchUsersData = async () => {
    const data = await getAllUsers();

    setUsers(data);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      await Promise.all([fetchRevenue(), fetchHotelsData(), fetchUsersData()]);

      setLoading(false);
    };

    if (currentUser?.role === "masterAdmin") {
      load();
    }
  }, [currentUser]);

  // ================================

  // ACTIONS

  // ================================

  const handleToggleHotel = async (hotelId) => {
    await toggleHotelStatus(hotelId);

    fetchHotelsData();
  };

  const handleToggleRole = async (user) => {
    if (user.role === "admin") {
      await demoteUser(user._id);
    } else {
      await promoteUser(user._id);
    }

    fetchUsersData();
  };

  const handleDeleteHotel = async (hotelId) => {
    const confirmDelete = window.confirm("Delete this hotel permanently?");

    if (!confirmDelete) return;

    await deleteHotel(hotelId);

    fetchHotelsData();
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm("Delete this user permanently?");

    if (!confirmDelete) return;

    await deleteUser(userId);

    fetchUsersData();
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* ================= HEADER ================= */}

      <div className="flex items-center gap-3 mb-10">
        <Shield className="w-8 h-8 text-primary" />

        <h1 className="text-3xl font-semibold">Master Admin Dashboard</h1>
      </div>

      {/* ================= REVENUE ================= */}

      <div className="bg-white shadow rounded-xl p-6 mb-10 border">
        <p className="text-sm text-gray-500">Total Revenue</p>

        <h2 className="text-4xl font-bold text-green-600 mt-2">
          ₹ {totalRevenue}
        </h2>
      </div>

      {/* ================= HOTELS ================= */}

      <div className="bg-white shadow rounded-xl p-6 mb-10 border">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Hotel className="w-5 h-5 text-blue-600" />
          Hotels Management
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3">Hotel Name</th>

                <th className="pb-3">Location</th>

                <th className="pb-3">Status</th>

                <th className="pb-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {hotels.map((hotel) => (
                <tr key={hotel._id} className="border-b">
                  <td className="py-4">{hotel.name}</td>

                  <td className="py-4">{hotel.location}</td>

                  <td className="py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        hotel.isActive
                          ? "bg-green-100 text-green-700 border-green-300"
                          : "bg-red-100 text-red-700 border-red-300"
                      }`}
                    >
                      {hotel.isActive ? "Enabled" : "Disabled"}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <button
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-700"
                        onClick={() => handleToggleHotel(hotel._id)}
                      >
                        {hotel.isActive ? "Disable" : "Enable"}
                      </button>

                      <button
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                        onClick={() => handleDeleteHotel(hotel._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= USERS ================= */}

      <div className="bg-white shadow rounded-xl p-6 border">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-600" />
          Users Management
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3">Email</th>

                <th className="pb-3">Role</th>

                <th className="pb-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b">
                  <td className="py-4">{user.email}</td>

                  <td className="py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        user.role === "admin"
                          ? "bg-blue-100 text-blue-700 border-blue-300"
                          : user.role === "masterAdmin"
                            ? "bg-purple-100 text-purple-700 border-purple-300"
                            : "bg-gray-100 text-gray-600 border-gray-300"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="py-4">
                    {user.role !== "masterAdmin" && (
                      <div className="flex gap-2">
                        <button
                          className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-700"
                          onClick={() => handleToggleRole(user)}
                        >
                          {user.role === "admin"
                            ? "Demote to User"
                            : "Promote to Admin"}
                        </button>

                        <button
                          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
