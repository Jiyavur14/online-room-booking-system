import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, Star } from 'lucide-react';
import { useAppContext } from '@/app/context/AppContext';
import Button from '@/app/components/Button';
import Input from '@/app/components/Input';
import Card from '@/app/components/Card';
import Chatbot from '@/app/components/Chatbot';
import axios from "axios";

export default function HomePage() {
  const { hotels, setSearchParams } = useAppContext();
  
  const navigate = useNavigate();
  
  const [searchForm, setSearchForm] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  });


  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [newsletterError, setNewsletterError] = useState(false);


  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams(searchForm);
    navigate('/hotels');
  };

  const handleChange = (field, value) => {
    setSearchForm(prev => ({ ...prev, [field]: value }));
  };

  // Get top rated hotels for recommendations
  const recommendedHotels = hotels
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative bg-gradient-to-br from-primary to-primary/80 text-white py-24"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="absolute inset-0 bg-primary/70"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 text-white">
              Find Your Perfect Stay
            </h1>
            <p className="text-xl text-white/90">
              Discover amazing hotels at the best prices worldwide
            </p>
          </div>

          {/* Search Form */}
          <Card className="max-w-5xl mx-auto bg-white">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-1">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
                  <input
                    id="location"
                    type="text"
                    placeholder="Enter city"
                    value={searchForm.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring text-gray-900 placeholder:text-gray-500 bg-white"
                    required
                  />
                </div>
              </div>

              <div className="lg:col-span-1">
                <label htmlFor="check-in" className="block text-sm font-medium text-gray-700 mb-1">
                  Check-in
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5 z-10 pointer-events-none" />
                  <input
                    id="check-in"
                    type="date"
                    value={searchForm.checkIn}
                    onChange={(e) => handleChange('checkIn', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full h-11 pl-10 pr-4 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring text-gray-900 bg-white"
                    required
                  />
                </div>
              </div>

              <div className="lg:col-span-1">
                <label htmlFor="check-out" className="block text-sm font-medium text-gray-700 mb-1">
                  Check-out
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5 z-10 pointer-events-none" />
                  <input
                    id="check-out"
                    type="date"
                    value={searchForm.checkOut}
                    onChange={(e) => handleChange('checkOut', e.target.value)}
                    min={searchForm.checkIn || new Date().toISOString().split('T')[0]}
                    className="w-full h-11 pl-10 pr-4 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring text-gray-900 bg-white"
                    required
                  />
                </div>
              </div>

              <div className="lg:col-span-1">
                <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
                  Guests
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
                  <input
                    id="guests"
                    type="number"
                    min="1"
                    max="10"
                    value={searchForm.guests}
                    onChange={(e) => handleChange('guests', parseInt(e.target.value))}
                    className="w-full h-11 pl-10 pr-4 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring text-gray-900 bg-white"
                    required
                  />
                </div>
              </div>

              <div className="lg:col-span-1 flex items-end">
                <Button type="submit" className="w-full h-11" size="md">
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </section>

      {/* Recommended Hotels */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-4">Recommended Hotels</h2>
            <p className="text-text-secondary">Handpicked selections for your perfect stay</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendedHotels.map(hotel => (
              <Card 
                key={hotel._id} 
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/hotel/${hotel._id}`)}
              >
               <div
                    className="h-48 bg-cover bg-center rounded-t-lg -mx-6 -mt-6 mb-4"
                   style={{backgroundImage: hotel.images ? `url(http://localhost:5000/${hotel.images})`: `url('/placeholder.jpg')`}}
              />
                <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3>
                <div className="flex items-center gap-2 text-text-secondary mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{hotel.location}</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1 text-accent">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-medium">{hotel.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-text-secondary mb-4">{hotel.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-sm text-text-muted">Starting from</span>
                 <span className="text-2xl font-semibold text-primary">
                 ₹{hotel.minPrice ? hotel.minPrice.toLocaleString('en-IN') : 'Not Available'}
                <span className="text-sm font-normal text-text-muted">/night</span>
                </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* User Testimonials */}
      <section className="py-16 bg-section-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-4">What Our Guests Say</h2>
            <p className="text-text-secondary">Real experiences from real travelers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Johnson', review: 'Amazing experience! The booking process was smooth and the hotel exceeded our expectations.', rating: 5 },
              { name: 'Michael Chen', review: 'Great platform for finding quality hotels at competitive prices. Highly recommended!', rating: 5 },
              { name: 'Emma Williams', review: 'User-friendly interface and excellent customer service. Will definitely use again.', rating: 5 }
            ].map((testimonial, index) => (
              <Card key={index}>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-text-secondary mb-4 italic">"{testimonial.review}"</p>
                <p className="font-semibold">{testimonial.name}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-white/90 mb-6 sm:mb-8 text-sm sm:text-base">
            Get exclusive deals and travel tips delivered to your inbox
          </p>
        <form 
            onSubmit={async (e) => {
               e.preventDefault();
                 setNewsletterMessage("");
                  setNewsletterError(false);

          try {
              await axios.post("http://localhost:5000/api/newsletter", {
                email: newsletterEmail,
                    });

                    setNewsletterMessage("Subscribed successfully 🎉");

                     setNewsletterError(false);
                       setNewsletterEmail("");
                      setTimeout(() => {
                       setNewsletterMessage("");
                     }, 3000);
                              } catch (error) {
                  setNewsletterMessage(
                  error.response?.data?.message || "Something went wrong"
                  );
                 setNewsletterError(true);
                 setTimeout(() => {
                 setNewsletterMessage("");
                 }, 3000);
                              }  }}
        className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-2xl mx-auto"
        >

     <input
     type="email"
     placeholder="Enter your email"
     value={newsletterEmail}
      onChange={(e) => setNewsletterEmail(e.target.value)}
     className="flex-1 h-12 px-4 sm:px-6 rounded-lg text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-accent w-full placeholder:text-gray-500"
     required
                            />

             <Button
                type="submit"
               variant="accent"
               size="lg"
              className="w-full sm:w-auto h-12 whitespace-nowrap">
                   Subscribe
              </Button>
          </form>
          {newsletterMessage && (

            <p
              className={`mt-4 text-sm font-medium ${
                newsletterError ? "text-red-300" : "text-green-200"
              }`}
            >
              {newsletterMessage}</p>)}
        </div>
      </section>

      {/* AI Chatbot */}
      <Chatbot />
    </div>
  );
}