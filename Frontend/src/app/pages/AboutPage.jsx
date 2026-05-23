import { Clock, Shield, CheckCircle, HeadphonesIcon, Star, Award, Users } from 'lucide-react';
import Card from '@/app/components/Card';

export default function AboutPage() {
  const features = [
    {
      icon: Clock,
      title: 'Easy Booking',
      description: 'Simple and quick booking process with real-time availability checking and instant confirmation.'
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Bank-level security for all transactions with multiple payment options including UPI and Net Banking.'
    },
    {
      icon: CheckCircle,
      title: 'Verified Hotels',
      description: 'All hotels are thoroughly verified and rated by real guests to ensure quality stays.'
    },
    {
      icon: HeadphonesIcon,
      title: '24/7 Support',
      description: 'Round-the-clock customer support to assist you with any queries or concerns during your journey.'
    }
  ];

  const stats = [
    { value: '10,000+', label: 'Happy Guests' },
    { value: '500+', label: 'Hotels Listed' },
    { value: '50+', label: 'Cities Covered' },
    { value: '4.8', label: 'Average Rating' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 md:mb-6">About StayNest</h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
              Your trusted partner in finding perfect accommodations across India. We connect travelers with quality hotels at the best prices.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <h2 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6">Who We Are</h2>
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>
                  StayNest is India's premier hotel booking platform, dedicated to making travel planning effortless and enjoyable. Founded with a vision to revolutionize the hospitality industry, we bridge the gap between travelers and exceptional accommodations.
                </p>
                <p>
                  Our platform features a carefully curated selection of hotels, from budget-friendly options to luxury resorts, ensuring there's something perfect for every traveler and every budget. With transparent pricing, verified reviews, and instant booking confirmation, we take the hassle out of travel planning.
                </p>
                <p>
                  Whether you're planning a business trip, family vacation, or weekend getaway, StayNest provides the tools and support you need to find and book your ideal stay with confidence.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-section-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm md:text-base text-text-secondary">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">Our Mission</h2>
              <p className="text-base md:text-lg text-text-secondary max-w-2xl mx-auto">
                To empower travelers with seamless booking experiences and help them discover memorable stays that exceed expectations. We're committed to building trust through transparency, quality, and exceptional service.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-8 md:mt-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full mb-3 md:mb-4">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">Guest-Centric</h3>
                <p className="text-sm text-text-secondary">
                  Every decision we make prioritizes guest satisfaction and comfort
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-success/10 rounded-full mb-3 md:mb-4">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                <h3 className="font-semibold mb-2">Quality Assured</h3>
                <p className="text-sm text-text-secondary">
                  Rigorous verification ensures only the best hotels on our platform
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-full mb-3 md:mb-4">
                  <Star className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-semibold mb-2">Excellence</h3>
                <p className="text-sm text-text-secondary">
                  Striving for excellence in every aspect of our service delivery
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 md:py-16 bg-section-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">Why Choose StayNest</h2>
            <p className="text-base md:text-lg text-text-secondary max-w-2xl mx-auto">
              Experience the difference with features designed to make your booking journey smooth and secure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-primary/10 rounded-full mb-4">
                    <Icon className="w-7 h-7 md:w-8 md:h-8 text-primary" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">{feature.title}</h3>
                  <p className="text-sm md:text-base text-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-base md:text-lg text-white/90 mb-6 md:mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied travelers who trust StayNest for their accommodation needs
            </p>
            <a
              href="/hotels"
              className="inline-flex items-center justify-center px-6 md:px-8 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-white/90 transition-colors"
            >
              Browse Hotels
            </a>
          </Card>
        </div>
      </section>
    </div>
  );
}
