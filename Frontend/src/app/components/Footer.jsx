import { Hotel, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-section-bg border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Hotel className="w-8 h-8 text-primary" />
              <span className="text-xl font-semibold text-primary">StayNest</span>
            </div>
            <p className="text-sm text-text-secondary">
              Your trusted partner for finding the perfect accommodation worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
              <li><a href="/hotels" className="hover:text-primary transition-colors">Hotels</a></li>
              <li><a href="/about" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="/contact" className="hover:text-primary transition-colors">Contact</a></li>
              <li>
                <a 
                  href="mailto:jiyavurrahman51@gmail.com?subject=Admin%20Access%20Request%20-%20StayNest&body=Hello%2C%0A%0AI%20would%20like%20to%20request%20admin%20access%20for%20my%20hotel.%0A%0AFull%20Name%3A%0AEmail%3A%0APhone%3A%0AHotel%20Name%3A%0ACity%3A%0ADescription%3A%0A%0AThank%20you."
                  className="hover:text-primary transition-colors"
                >
                  Request Admin Access
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><a href="/faq" className="hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="/terms" className="hover:text-primary transition-colors">Terms & Conditions</a></li>
              <li><a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="/help" className="hover:text-primary transition-colors">Help Center</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+91 98467 47567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>jiyavurrahman51@gmail.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>123 Nehru Street, Trichy, 600021, TamilNadu</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-text-muted">
          <p>&copy; {new Date().getFullYear()} StayNest. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}