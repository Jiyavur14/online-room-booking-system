import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Star, Filter, SlidersHorizontal } from "lucide-react";
import { useAppContext } from "@/app/context/AppContext";
import Button from "@/app/components/Button";
import Card from "@/app/components/Card";

export default function HotelListingPage() {
  const { hotels, searchParams } = useAppContext();

  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 100000,
    rating: 0,
    amenities: [],
  });
  const [sortBy, setSortBy] = useState("recommended");

  // Filter and sort hotels
  const filteredHotels = useMemo(() => {
    let result = hotels.filter((hotel) => {
      if (
        searchParams.location &&
        !hotel.location
          .toLowerCase()
          .includes(searchParams.location.toLowerCase())
      ) {
        return false;
      }

      const minPrice = hotel.minPrice || 0;

      if (minPrice < filters.priceMin || minPrice > filters.priceMax) {
        return false;
      }

      if (hotel.rating < filters.rating) {
        return false;
      }

      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every((amenity) =>
          hotel.amenities.includes(amenity),
        );
        if (!hasAllAmenities) return false;
      }

      return true;
    });

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => {
          const aMin = a.minPrice || 0;

          const bMin = b.minPrice || 0;

          return aMin - bMin;
        });
        break;
      case "price-high":
        result.sort((a, b) => {
          const aMin = a.minPrice || 0;

          const bMin = b.minPrice || 0;

          return bMin - aMin;
        });
        break;

      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;

      default:
        result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [hotels, searchParams, filters, sortBy]);

  const allAmenities = [...new Set(hotels.flatMap((h) => h.amenities))];

  const toggleAmenity = (amenity) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold mb-2">Available Hotels</h1>
          {searchParams.location && (
            <p className="text-text-secondary">
              Showing results for {searchParams.location}
              {searchParams.checkIn && ` from ${searchParams.checkIn}`}
              {searchParams.checkOut && ` to ${searchParams.checkOut}`}
            </p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <Card className="sticky top-20">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Filters</h3>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block font-medium mb-3">Price Range</label>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    value={filters.priceMax}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        priceMax: parseInt(e.target.value),
                      }))
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-text-secondary">
                    <span>₹{filters.priceMin.toLocaleString("en-IN")}</span>
                    <span>₹{filters.priceMax.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <label className="block font-medium mb-3">Minimum Rating</label>
                <div className="space-y-2">
                  {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                    <label
                      key={rating}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="rating"
                        checked={filters.rating === rating}
                        onChange={() =>
                          setFilters((prev) => ({ ...prev, rating }))
                        }
                        className="w-4 h-4 text-primary"
                      />
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-accent text-accent" />
                        <span className="text-sm">{rating}+</span>
                      </div>
                    </label>
                  ))}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.rating === 0}
                      onChange={() =>
                        setFilters((prev) => ({ ...prev, rating: 0 }))
                      }
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-sm">Any rating</span>
                  </label>
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <label className="block font-medium mb-3">Amenities</label>
                <div className="space-y-2">
                  {allAmenities.map((amenity) => (
                    <label
                      key={amenity}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filters.amenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="w-4 h-4 text-primary rounded"
                      />
                      <span className="text-sm">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  setFilters({
                    priceMin: 0,
                    priceMax: 100000,
                    rating: 0,
                    amenities: [],
                  })
                }
              >
                Clear Filters
              </Button>
            </Card>
          </aside>

          {/* Hotel List */}
          <main className="flex-1">
            {/* Sort Options */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-text-secondary">
                {filteredHotels.length}{" "}
                {filteredHotels.length === 1 ? "hotel" : "hotels"} found
              </p>
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-text-secondary" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-10 px-4 rounded-lg border border-border bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Hotels Grid */}
            {filteredHotels.length === 0 ? (
              <Card className="text-center py-12">
                <p className="text-text-secondary">
                  No hotels found matching your criteria.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setFilters({
                      priceMin: 0,
                      priceMax: 100000,
                      rating: 0,
                      amenities: [],
                    });
                  }}
                >
                  Clear Filters
                </Button>
              </Card>
            ) : (
              <div className="space-y-6">
                {filteredHotels.map((hotel) => (
                  <Card
                    key={hotel._id}
                    className="flex flex-col md:flex-row gap-6 cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => navigate(`/hotel/${hotel._id}`)}
                  >
                    <div
                      className="w-full md:w-64 h-48 bg-cover bg-center rounded-lg flex-shrink-0"
                      style={{
                        backgroundImage: `url(https://online-room-booking-system.onrender.com/${hotel.images[0]})`,
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">
                        {hotel.name}
                      </h3>
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1 text-accent">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="font-medium">{hotel.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-text-secondary">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{hotel.location}</span>
                        </div>
                      </div>
                      <p className="text-text-secondary text-sm mb-4">
                        {hotel.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {hotel.amenities.slice(0, 4).map((amenity) => (
                          <span
                            key={amenity}
                            className="px-3 py-1 bg-section-bg text-text-secondary text-xs rounded-full"
                          >
                            {amenity}
                          </span>
                        ))}
                        {hotel.amenities.length > 4 && (
                          <span className="px-3 py-1 bg-section-bg text-text-secondary text-xs rounded-full">
                            +{hotel.amenities.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex md:flex-col justify-between md:justify-start items-end gap-4">
                      <div className="text-right">
                        <p className="text-sm text-text-muted mb-1">
                          Starting from
                        </p>
                        <p className="text-3xl font-semibold text-primary">
                          ₹
                          {hotel.minPrice
                            ? hotel.minPrice.toLocaleString("en-IN")
                            : "N/A"}
                        </p>
                        <p className="text-sm text-text-muted">per night</p>
                      </div>
                      <Button variant="primary">View Details</Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
