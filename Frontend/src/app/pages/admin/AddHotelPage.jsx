import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hotel, Image, MapPin, CheckSquare, X } from 'lucide-react';
import { useAppContext } from '@/app/context/AppContext';
import Button from '@/app/components/Button';
import Input from '@/app/components/Input';
import Card from '@/app/components/Card';

export default function AddHotelPage() {
  const { currentUser, addHotel } = useAppContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    rating: 4.0
  });

  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const amenitiesOptions = [
    'WiFi', 'Pool', 'AC','Minibar', 'Gym', 'Spa', 'Restaurant', 'Parking',
    'Beach Access', 'Bar', 'Room Service', 'Business Center','Kitchen',
    'Balcony', 'Fireplace', 'Welcome Drink'
  ];

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/');
    }
  }, [currentUser, navigate]);

  if (!currentUser || currentUser.role !== 'admin') {
    return null;
  }

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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Limit to 4 images
    const selectedFiles = files.slice(0, 4);
    setImageFiles(selectedFiles);

    // Create previews
    const previews = selectedFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    // Revoke the URL to avoid memory leaks
    URL.revokeObjectURL(imagePreviews[index]);
    
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };


const handleSubmit = async (e) => {
        e.preventDefault();

  /*const handleSubmit = (e) => {
    e.preventDefault();*/

    // In a real app, you would upload images to a server here
    // For this demo, we'll use a placeholder image


      /*
    const newHotel = {
      ...formData,
      images: imageUrls,
      amenities: selectedAmenities,
      rating: parseFloat(formData.rating)
    };

    addHotel(newHotel);*/
  try {
    const form = new FormData();
    form.append('name', formData.name);
    form.append('location', formData.location);
    form.append('description', formData.description);
    form.append('rating', formData.rating);

    form.append("amenities",JSON.stringify(selectedAmenities));

    // Append actual image files
    imageFiles.forEach(file => form.append('images', file));

    await addHotel(form); // AppContext will handle the API call
    navigate('/admin/dashboard');
  } catch (error) {
    console.error("Failed to add hotel:", error);
  }
};

  useEffect(() => {
    // Cleanup previews on unmount
    return () => {
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, []);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">Add New Hotel</h1>
          <p className="text-text-secondary">Register a new property in the system</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Hotel className="w-5 h-5 text-primary" />
                Basic Information
              </h3>

              <div className="space-y-4">
                <Input
                  label="Hotel Name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Grand Plaza Hotel"
                  required
                />

                <Input
                  label="City"
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="Mumbai"
                  required
                />

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Describe your hotel..."
                    rows="4"
                    className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    required
                  />
                </div>

                <Input
                  label="Rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => handleChange('rating', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Image className="w-5 h-5 text-primary" />
                Hotel Images
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Upload Images (Max 4)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:cursor-pointer hover:file:bg-primary/90"
                  />
                  <p className="text-xs text-text-muted mt-2">
                    Select up to 4 images for your hotel
                  </p>
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-3">Preview:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <div
                            className="h-32 bg-cover bg-center rounded-lg border border-border"
                            style={{ backgroundImage: `url(${preview})` }}
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 p-1 bg-error text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-primary" />
                Hotel Amenities
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {amenitiesOptions.map(amenity => (
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

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t border-border">
              <Button type="submit" size="lg">
                Add Hotel
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

