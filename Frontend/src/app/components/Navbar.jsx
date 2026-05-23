import { Link, useNavigate } from "react-router-dom";
import {
  Hotel,
  LogOut,
  User,
  Home,
  Building2,
  Mail,
  Info,
  Menu,
  X,
} from "lucide-react";
import { useAppContext } from "@/app/context/AppContext";
import Button from "@/app/components/Button";
import { useState } from "react";

export default function Navbar() {
  const { currentUser, logout } = useAppContext();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Hotel className="w-8 h-8 text-primary" />
            <span className="text-2xl font-semibold text-primary">
              StayNest
            </span>
          </Link>

          {/* Main Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <Home className="w-4 h-4" />
                Home
              </Button>
            </Link>
            <Link to="/hotels">
              <Button variant="ghost" size="sm" className="gap-2">
                <Building2 className="w-4 h-4" />
                Hotels
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="ghost" size="sm" className="gap-2">
                <Info className="w-4 h-4" />
                About
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="ghost" size="sm" className="gap-2">
                <Mail className="w-4 h-4" />
                Contact
              </Button>
            </Link>
          </div>

          {/* User Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {currentUser ? (
              <>
                {/* Admin Dashboard link - only for admins */}
                {currentUser.role === "admin" && (
                  <Link to="/admin/dashboard">
                    <Button variant="ghost" size="sm">
                      Admin Dashboard
                    </Button>
                  </Link>
                )}

                {currentUser.role === "masterAdmin" && (
                  <Link to="/master-admin-dashboard">
                    <Button variant="ghost" size="sm">
                      Master Dashboard
                    </Button>
                  </Link>
                )}

                <Link to="/bookings">
                  <Button variant="ghost" size="sm">
                    My Bookings
                  </Button>
                </Link>

                <div className="flex items-center gap-3 pl-4 border-l border-border">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-text-secondary" />
                    <span className="text-sm font-medium">
                      {currentUser.email}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </>
            ) : (
              <Link to="/login">
                <Button variant="primary" size="sm">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-section-bg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-text" />
            ) : (
              <Menu className="w-6 h-6 text-text" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2"
                >
                  <Home className="w-4 h-4" />
                  Home
                </Button>
              </Link>
              <Link to="/hotels" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2"
                >
                  <Building2 className="w-4 h-4" />
                  Hotels
                </Button>
              </Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2"
                >
                  <Info className="w-4 h-4" />
                  About
                </Button>
              </Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Contact
                </Button>
              </Link>
              {currentUser ? (
                <>
                  <div className="border-t border-border my-2"></div>

                  {currentUser.role === "admin" && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                      >
                        Admin Dashboard
                      </Button>
                    </Link>
                  )}

                  {currentUser.role === "masterAdmin" && (
                    <Link
                      to="/master-admin-dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                      >
                        Master Dashboard
                      </Button>
                    </Link>
                  )}

                  <Link to="/bookings" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                    >
                      My Bookings
                    </Button>
                  </Link>

                  <div className="flex items-center justify-between px-3 py-2 bg-section-bg rounded-lg mt-2">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-text-secondary" />
                      <span className="text-sm font-medium">
                        {currentUser.email}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="border-t border-border my-2"></div>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" size="sm" className="w-full">
                      Login
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
