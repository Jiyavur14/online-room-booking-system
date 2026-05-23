import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';
import Card from '@/app/components/Card';
import Button from '@/app/components/Button';
import Input from '@/app/components/Input';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {

  e.preventDefault();

  try {

    const res = await fetch("http://localhost:5000/api/contact", {

      method: "POST",

      headers: {

        "Content-Type": "application/json",

      },

      body: JSON.stringify(formData),

    });

    if (!res.ok) {

      throw new Error("Failed to send message");

    }

    setSubmitted(true);

    setTimeout(() => {

      setFormData({ name: '', email: '', subject: '', message: '' });

      setSubmitted(false);

    }, 3000);

  } catch (error) {

    console.error("Contact form error:", error);

    alert("Something went wrong. Please try again.");

  }

};


    
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 text-white py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Mail className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-accent" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            We're here to help! Reach out to us with any questions or concerns
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-4 sm:space-y-6">
              <Card>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="bg-primary/10 p-2.5 sm:p-3 rounded-lg flex-shrink-0">
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-1">Phone</h3>
                    <p className="text-text-secondary text-sm mb-1">+91 98467 47567</p>
                    <p className="text-text-muted text-xs">Mon-Fri, 9am-6pm EST</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="bg-primary/10 p-2.5 sm:p-3 rounded-lg flex-shrink-0">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-1">Email</h3>
                    <p className="text-text-secondary text-sm mb-1 break-all">jiyavurrahman51@gmail.com</p>
                    <p className="text-text-muted text-xs">We'll respond within 24 hours</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="bg-primary/10 p-2.5 sm:p-3 rounded-lg flex-shrink-0">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-1">Address</h3>
                    <p className="text-text-secondary text-sm mb-1">
                      123,Nehru Street<br />
                      Trichy, 600021<br />
                      TamilNadu
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="bg-primary/10 p-2.5 sm:p-3 rounded-lg flex-shrink-0">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-1">Business Hours</h3>
                    <p className="text-text-secondary text-sm">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Send Us a Message</h2>
                
                {submitted ? (
                  <div className="bg-success/10 border border-success text-success p-4 sm:p-6 rounded-lg text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <Send className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">Message Sent Successfully!</h3>
                    <p className="text-sm sm:text-base">Thank you for contacting us. We'll get back to you soon.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          className="w-full h-11 px-4 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring text-gray-900 placeholder:text-gray-500 bg-white"
                          placeholder="John Doe"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          className="w-full h-11 px-4 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring text-gray-900 placeholder:text-gray-500 bg-white"
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => handleChange('subject', e.target.value)}
                        className="w-full h-11 px-4 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring text-gray-900 placeholder:text-gray-500 bg-white"
                        placeholder="How can we help you?"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Message *
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => handleChange('message', e.target.value)}
                        rows="6"
                        className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring resize-none text-gray-900 placeholder:text-gray-500 bg-white"
                        placeholder="Please describe your inquiry in detail..."
                        required
                      />
                    </div>

                    <Button type="submit" variant="primary" size="lg" className="w-full">
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </Button>
                  </form>
                )}
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 bg-section-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Frequently Asked Questions</h2>
            <p className="text-sm sm:text-base text-text-secondary">Quick answers to common questions</p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: 'How do I cancel or modify my booking?',
                answer: 'You can cancel or modify your booking by logging into your account and visiting the "My Bookings" page. Cancellation policies vary by hotel.'
              },
              {
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and select digital wallets.'
              },
              {
                question: 'Is it safe to book through your platform?',
                answer: 'Yes! We use industry-standard SSL encryption to protect your personal and payment information. Your security is our top priority.'
              },
              {
                question: 'Do you offer customer support?',
                answer: 'Absolutely! Our customer support team is available 24/7 via phone, email, or live chat to assist you with any questions or concerns.'
              }
            ].map((faq, index) => (
              <Card key={index}>
                <h3 className="text-base sm:text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-text-secondary text-sm">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}