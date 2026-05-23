import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bed, Search, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAppContext } from '@/app/context/AppContext';
import Button from '@/app/components/Button';
import Card from '@/app/components/Card';

export default function ManageRoomsPage() {
  const { currentUser, getAdminRooms, toggleRoomStatus } = useAppContext();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterHotel, setFilterHotel] = useState('all');

  const uniqueHotels = [
    ...new Map(
      rooms
        .filter(room => room.hotel)
        .map(room => [room.hotel._id,
          room.hotel])
    ).values()
  ];

  useEffect(() => {
  const fetchRooms = async () => {
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/");
      return;

    }
    const data = await getAdminRooms();
    setRooms(data);
  };
  fetchRooms();
}, [currentUser]);


 const filteredRooms = rooms.filter(room => {
  const matchesSearch =
    room.roomType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (room.hotel?.name || "").toLowerCase().includes(searchTerm.toLowerCase());

  const matchesHotel = filterHotel === "all" || room.hotel?._id === filterHotel;

  return matchesSearch && matchesHotel;
});

 const handleToggle = async (roomId) => {

  await toggleRoomStatus(roomId);

  // Refresh rooms

  const updated = await getAdminRooms();

  setRooms(updated);

};


  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">Manage Rooms</h1>
          <p className="text-text-secondary">
            Control room availability and view all room listings
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search rooms or hotels..."
                className="w-full h-11 pl-10 pr-4 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring text-gray-900 placeholder:text-gray-500 bg-white"
              />
            </div>

            <select
              value={filterHotel}
              onChange={(e) => setFilterHotel(e.target.value)}
              className="h-11 px-4 rounded-lg border border-border bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Hotels</option>
                {uniqueHotels.map(hotel => (
                <option key={hotel._id} value={hotel._id}>
                  {hotel.name || "Unknown Hotel"}
                </option>
              ))}
            </select>
          </div>
        </Card>

        {/* Rooms Table */}
        <Card>
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              All Rooms ({filteredRooms.length})
            </h2>
          </div>

          {filteredRooms.length === 0 ? (
            <div className="text-center py-12">
              <Bed className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <p className="text-text-secondary mb-4">
                {searchTerm || filterHotel !== 'all'
                  ? 'No rooms found matching your filters'
                  : 'No rooms have been added yet'}
              </p>
              {!searchTerm && filterHotel === 'all' && (
                <Button onClick={() => navigate('/admin/add-room')}>
                  Add Your First Room
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 text-sm font-semibold text-text-secondary">Hotel</th>
                    <th className="pb-3 text-sm font-semibold text-text-secondary">Location</th>
                    <th className="pb-3 text-sm font-semibold text-text-secondary">Room Type</th>
                    <th className="pb-3 text-sm font-semibold text-text-secondary">Price/Night</th>
                    <th className="pb-3 text-sm font-semibold text-text-secondary">Available</th>
                    <th className="pb-3 text-sm font-semibold text-text-secondary">Amenities</th>
                    <th className="pb-3 text-sm font-semibold text-text-secondary">Status</th>
                    <th className="pb-3 text-sm font-semibold text-text-secondary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRooms.map(room => (
                    <tr key={room._id} className="border-b border-border">
                      <td className="py-4 font-medium">{room.hotel?.name || "Unknown Hotel"}</td>
                      <td className="py-4 text-sm text-text-secondary">
                        {room.hotel?.location || "N/A"}
                      </td>
                      <td className="py-4 font-medium">{room.roomType}</td>
                      <td className="py-4 text-primary font-semibold">₹{room.pricePerNight}</td>
                      <td className="py-4">{room.totalRooms}</td>
                      <td className="py-4">{room.amenities.join(", ")}</td>
                      <td className="py-4">
                        {room.status ? (
                          <span className="px-3 py-1 bg-success/10 text-success text-xs font-medium rounded-full border border-success/30">
                            Active
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-error/10 text-error text-xs font-medium rounded-full border border-error/30">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="py-4">
                        <button
                          onClick={() => handleToggle(room._id)}
                          className="text-primary font-medium"
                        >
                          {room.status ? "Disable" : "Enable"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

      {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <Card>
                <p className="text-sm text-text-muted mb-1">Total Rooms</p>
                <p className="text-2xl font-bold text-primary">{rooms.length}</p>
              </Card>

              <Card>
                <p className="text-sm text-text-muted mb-1">Active Rooms</p>
                <p className="text-2xl font-bold text-success">
                  {rooms.filter(r => r.status === true).length}
                </p>
              </Card>

              <Card>
                <p className="text-sm text-text-muted mb-1">Inactive Rooms</p>
                <p className="text-2xl font-bold text-error">
                  {rooms.filter(r => r.status === false).length}
                </p>
              </Card>
            </div>
      </div>
    </div>
  );
}