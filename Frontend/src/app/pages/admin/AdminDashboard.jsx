import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Hotel, Bed, TrendingUp, Calendar, User, CheckCircle, Clock } from 'lucide-react';
import { useAppContext } from '@/app/context/AppContext';
import Button from '@/app/components/Button';
import Card from '@/app/components/Card';

export default function AdminDashboard() {
  const { currentUser, bookings, hotels, getAdminDashboard } = useAppContext();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [showAllBookings, setShowAllBookings] = useState(false);

  useEffect(() => {
   const fetchDashboard = async () => {

    if (!currentUser || currentUser.role !== "admin") {
      navigate("/");
      return;

    }

    const data = await getAdminDashboard(showAllBookings);
    setDashboardData(data);

   };
     fetchDashboard();
  }, [currentUser]);

  const handleViewAll = async () => {
  setShowAllBookings(true);

  const data = await getAdminDashboard(true);
  setDashboardData(data);
   };

  if(!dashboardData){
    return <div className="p-8">Loading dashboard...</div>;
  }


  if (!currentUser || currentUser.role !== 'admin') {
    return null;
  }

  // Filter data by admin's hotelId
 /* const adminHotel = hotels.find(h => h.id === currentUser.hotelId);
  const adminHotels = adminHotel ? [adminHotel] : [];
  
  // Filter bookings for this hotel only
  const adminBookings = bookings.filter(b => b.hotelId === currentUser.hotelId);

  // Calculate stats for this hotel only
  const totalBookings = adminBookings.length;
  const totalRevenue = adminBookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + b.totalAmount, 0);
  const totalHotels = adminHotels.length;
  const totalRooms = adminHotels.reduce((sum, h) => sum + (h.rooms?.length || 0), 0);*/

  const {stats, recentBookings} = dashboardData;
  const totalRevenue = stats.totalRevenue;
  const totalBookings = stats.totalBookings;
  const totalHotels = stats.totalHotels;
  const totalRooms = stats.totalRooms
  

//  const recentBookings = adminBookings
 //   .sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate))
 //   .slice(0, 10);

  const getStatusBadge = (status) => {
    const styles = {
      confirmed: 'bg-success/10 text-success border-success/30',
      pending: 'bg-warning/10 text-warning border-warning/30',
      cancelled: 'bg-error/10 text-error border-error/30'
    };
    return styles[status] || 'bg-section-bg text-text-secondary border-border';
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold mb-2">Admin Dashboard</h1>
            <p className="text-sm sm:text-base text-text-secondary">Manage hotels, rooms, and bookings</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={() => navigate('/admin/add-hotel')} className="w-full sm:w-auto">
              <Hotel className="w-4 h-4 mr-2" />
              Add Hotel
            </Button>
            <Button variant="secondary" onClick={() => navigate('/admin/add-room')} className="w-full sm:w-auto">
              <Bed className="w-4 h-4 mr-2" />
              Add Room
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs sm:text-sm text-text-muted mb-1">Total Revenue</p>
                <p className="text-2xl sm:text-3xl font-bold text-primary">₹{dashboardData.stats.totalRevenue.toLocaleString('en-IN')}</p>
                <p className="text-xs sm:text-sm text-success mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                  +12% from last month
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-primary/10 rounded-lg">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs sm:text-sm text-text-muted mb-1">Total Bookings</p>
                <p className="text-2xl sm:text-3xl font-bold text-primary">{dashboardData.stats.totalBookings}</p>
                <p className="text-xs sm:text-sm text-text-secondary mt-2">All time bookings</p>
              </div>
              <div className="p-2 sm:p-3 bg-accent/10 rounded-lg">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs sm:text-sm text-text-muted mb-1">Total Hotels</p>
                <p className="text-2xl sm:text-3xl font-bold text-primary">{dashboardData.stats.totalHotels}</p>
                <p className="text-xs sm:text-sm text-text-secondary mt-2">Active properties</p>
              </div>
              <div className="p-2 sm:p-3 bg-secondary/10 rounded-lg">
                <Hotel className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs sm:text-sm text-text-muted mb-1">Total Rooms</p>
                <p className="text-2xl sm:text-3xl font-bold text-primary">{dashboardData.stats.totalRooms}</p>
                <p className="text-xs sm:text-sm text-text-secondary mt-2">Across all hotels</p>
              </div>
              <div className="p-2 sm:p-3 bg-info/10 rounded-lg">
                <Bed className="w-5 h-5 sm:w-6 sm:h-6 text-info" />
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/admin/add-hotel')}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 sm:p-4 bg-primary/10 rounded-lg">
                <Hotel className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-1">Add New Hotel</h3>
                <p className="text-xs sm:text-sm text-text-secondary">Register a new property</p>
              </div>
            </div>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/admin/add-room')}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 sm:p-4 bg-accent/10 rounded-lg">
                <Bed className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-1">Add New Room</h3>
                <p className="text-xs sm:text-sm text-text-secondary">Create room listings</p>
              </div>
            </div>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/admin/manage-rooms')}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 sm:p-4 bg-secondary/10 rounded-lg">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-secondary" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-1">Manage Rooms</h3>
                <p className="text-xs sm:text-sm text-text-secondary">Update availability</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Bookings */}
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg sm:text-xl font-semibold">Recent Bookings</h2>
            <Button variant="ghost" size="sm" onClick={handleViewAll}>View All</Button>
          </div>

          {recentBookings.length === 0 ? (
            <div className="text-center py-8 text-text-secondary">
              No bookings yet
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 text-xs sm:text-sm font-semibold text-text-secondary">Booking ID</th>
                    <th className="pb-3 text-xs sm:text-sm font-semibold text-text-secondary">Hotel</th>
                    <th className="pb-3 text-xs sm:text-sm font-semibold text-text-secondary">Room Type</th>
                    <th className="pb-3 text-xs sm:text-sm font-semibold text-text-secondary">Guest</th>
                    <th className="pb-3 text-xs sm:text-sm font-semibold text-text-secondary">Check-in</th>
                    <th className="pb-3 text-xs sm:text-sm font-semibold text-text-secondary">Amount</th>
                    <th className="pb-3 text-xs sm:text-sm font-semibold text-text-secondary">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentBookings.map(booking => (
                    <tr key={booking._id} className="border-b border-border">
                      <td className="py-4 text-xs sm:text-sm">
                        <code className="bg-section-bg px-2 py-1 rounded text-xs">
                          {booking._id.slice(0, 8)}
                        </code>
                      </td>
                      <td className="py-4 text-xs sm:text-sm font-medium">{booking.hotel?.name}</td>
                      <td className="py-4 text-xs sm:text-sm text-text-secondary">{booking.room?.roomType}</td>
                      <td className="py-4 text-xs sm:text-sm">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-text-muted" />
                          {booking.guests} guest{booking.guests > 1 ? 's' : ''}
                        </div>
                      </td>
                      <td className="py-4 text-xs sm:text-sm text-text-secondary">
                        {new Date(booking.checkIn).toLocaleDateString()}
                      </td>
                      <td className="py-4 text-xs sm:text-sm font-semibold text-primary">
                        ₹{booking.totalPrice.toLocaleString('en-IN')}
                      </td>
                      <td className="py-4">
                        <span
                          className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}