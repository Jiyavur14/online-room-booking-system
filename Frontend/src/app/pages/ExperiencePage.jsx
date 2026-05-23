import { Compass, MapPin, Star, Users, Clock } from 'lucide-react';
import Card from '@/app/components/Card';
import Button from '@/app/components/Button';

export default function ExperiencePage() {
  const experiences = [
    {
      id: 1,
      title: 'City Food Tour',
      location: 'New York',
      duration: '3 hours',
      rating: 4.8,
      price: 75,
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600',
      description: 'Explore the culinary delights of the city with a local guide',
      capacity: 12
    },
    {
      id: 2,
      title: 'Beach Sunset Cruise',
      location: 'Miami',
      duration: '2 hours',
      rating: 4.9,
      price: 120,
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600',
      description: 'Enjoy a romantic sunset cruise along the beautiful coastline',
      capacity: 20
    },
    {
      id: 3,
      title: 'Mountain Hiking Adventure',
      location: 'Denver',
      duration: '5 hours',
      rating: 4.7,
      price: 95,
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600',
      description: 'Challenge yourself with a guided hike through scenic mountain trails',
      capacity: 8
    },
    {
      id: 4,
      title: 'Wine Tasting Experience',
      location: 'San Francisco',
      duration: '4 hours',
      rating: 4.9,
      price: 150,
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600',
      description: 'Visit local wineries and taste premium wines with an expert sommelier',
      capacity: 15
    },
    {
      id: 5,
      title: 'Historical Walking Tour',
      location: 'Boston',
      duration: '2.5 hours',
      rating: 4.6,
      price: 45,
      image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=600',
      description: 'Discover the rich history of the city through iconic landmarks',
      capacity: 20
    },
    {
      id: 6,
      title: 'Art Gallery Experience',
      location: 'Los Angeles',
      duration: '3 hours',
      rating: 4.8,
      price: 65,
      image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=600',
      description: 'Explore contemporary art galleries with a professional art curator',
      capacity: 10
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section 
        className="relative bg-gradient-to-br from-primary to-primary/80 text-white py-20"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="absolute inset-0 bg-primary/70"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Compass className="w-16 h-16 mx-auto mb-4 text-accent" />
          <h1 className="text-5xl font-bold mb-4 text-white">
            Discover Amazing Experiences
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Create unforgettable memories with curated local experiences and activities
          </p>
        </div>
      </section>

      {/* Experiences Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experiences.map(experience => (
              <Card 
                key={experience.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div 
                  className="h-48 bg-cover bg-center rounded-t-lg -mx-6 -mt-6 mb-4"
                  style={{ backgroundImage: `url(${experience.image})` }}
                />
                
                <h3 className="text-xl font-semibold mb-2">{experience.title}</h3>
                
                <div className="flex items-center gap-2 text-text-secondary mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{experience.location}</span>
                </div>

                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1 text-accent">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-medium text-sm">{experience.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-text-secondary">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{experience.duration}</span>
                  </div>
                  <div className="flex items-center gap-1 text-text-secondary">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">Up to {experience.capacity}</span>
                  </div>
                </div>

                <p className="text-sm text-text-secondary mb-4">
                  {experience.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <span className="text-sm text-text-muted">From</span>
                    <div className="text-2xl font-semibold text-primary">
                      ₹{(experience.price * 83).toLocaleString('en-IN')}
                      <span className="text-sm font-normal text-text-muted">/person</span>
                    </div>
                  </div>
                  <Button size="sm" variant="primary">
                    Book Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-section-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-semibold mb-4">Can't Find What You're Looking For?</h2>
          <p className="text-text-secondary mb-8">
            Let us create a custom experience tailored to your interests
          </p>
          <Button variant="primary" size="lg">
            Request Custom Experience
          </Button>
        </div>
      </section>
    </div>
  );
}