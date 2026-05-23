import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bed, DollarSign, CheckSquare } from 'lucide-react';
import { useAppContext } from '@/app/context/AppContext';
import Button from '@/app/components/Button';
import Input from '@/app/components/Input';
import Card from '@/app/components/Card';

export default function AddRoomPage() {
  const { currentUser, hotels, addRoom } = useAppContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
  hotel: '',
  roomType: '',
  pricePerNight: '',
  totalRooms: ''
});

  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const roomTypes = [
  "Single Room",
  "Double Room",
  "Twin Room",
  "Family Room",
  "Luxury Room",
  "Executive Room"
];

  const roomAmenities = [
    'WiFi', 'TV', 'AC', 'Minibar', 'Balcony', 'Kitchen',
    'Desk', 'Safe', 'Coffee Maker', 'Bathtub', 'Fireplace', 'Welcome Drink'
  ];

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/');
    }
  }, [currentUser, navigate]);

  if (!currentUser || currentUser.role !== 'admin') {
    return null;
  }

  // Filter hotels to only show admin's hotel

  //i dont know here 
  const adminHotels = hotels.filter(h => h.createdBy?._id === currentUser._id);



  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleAmenity = (amenity) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newRoom = {
      ...formData,
      pricePerNight: parseFloat(formData.pricePerNight),
      totalRooms: parseInt(formData.totalRooms),
      amenities: selectedAmenities
    };

    addRoom(newRoom);
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">Add New Room</h1>
          <p className="text-text-secondary">Create a new room listing for a hotel</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hotel Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Bed className="w-5 h-5 text-primary" />
                Room Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Select Hotel <span className="text-error">*</span>
                  </label>
                  <select
                    value={formData.hotel}
                    onChange={(e) => handleChange('hotel', e.target.value)}
                    className="w-full h-11 px-4 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  >
                    <option value="">Choose a hotel...</option>
                    {adminHotels.map(hotel => (
                      <option key={hotel._id} value={hotel._id}>
                        {hotel.name} - {hotel.location}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Room Type <span className="text-error">*</span>
                  </label>
                  <select
                    value={formData.roomType}
                    onChange={(e) => handleChange('roomType', e.target.value)}
                    className="w-full h-11 px-4 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  >
                    <option value="">Select room type...</option>
                    {roomTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Price per Night"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.pricePerNight}
                  onChange={(e) => handleChange('pricePerNight', e.target.value)}
                  placeholder="700"
                  required
                />

                <Input
                  label="Number of Rooms Available"
                  type="number"
                  min="1"
                  value={formData.totalRooms}
                  onChange={(e) => handleChange('totalRooms', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Room Amenities */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-primary" />
                Room Amenities
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {roomAmenities.map(amenity => (
                  <label
                    key={amenity}
                    className="flex items-center gap-2 p-3 border border-border rounded-lg cursor-pointer hover:bg-section-bg transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                      className="w-4 h-4 text-primary rounded"
                    />
                    <span className="text-sm">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Preview */}
            {formData.hotel && formData.roomType && formData.pricePerNight && (
              <div className="bg-section-bg p-6 rounded-lg">
                <h4 className="font-semibold mb-4">Preview</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-text-muted">Hotel:</span>{' '}
                    <span className="font-medium">
                      {hotels.find(h => h._id === formData.hotel)?.name}
                    </span>
                  </p>
                  <p>
                    <span className="text-text-muted">Room Type:</span>{' '}
                    <span className="font-medium">{formData.roomType}</span>
                  </p>
                  <p>
                    <span className="text-text-muted">Price:</span>{' '}
                    <span className="font-medium text-primary">₹{parseFloat(formData.pricePerNight).toLocaleString('en-IN')}/night</span>
                  </p>
                  <p>
                    <span className="text-text-muted">Available Rooms:</span>{' '}
                    <span className="font-medium">{formData.totalRooms}</span>
                  </p>
                  {selectedAmenities.length > 0 && (
                    <p>
                      <span className="text-text-muted">Amenities:</span>{' '}
                      <span className="font-medium">{selectedAmenities.join(', ')}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t border-border">
              <Button type="submit" size="lg">
                Add Room
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => navigate('/admin/dashboard')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}