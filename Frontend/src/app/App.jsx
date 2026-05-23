import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "@/app/context/AppContext";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ScrollToTop from "@/app/components/ScrollToTop";
import AdminRoute from "./components/AdminRoute";
import RoleRoute from "@/app/components/RoleRoute";
import { useAppContext } from "./context/AppContext";

// Pages
import HomePage from "@/app/pages/HomePage";
import LoginPage from "@/app/pages/LoginPage";
import HotelListingPage from "@/app/pages/HotelListingPage";
import SpecificHotelPage from "@/app/pages/SpecificHotelPage";
import MyBookingsPage from "@/app/pages/MyBookingsPage";
import PaymentPage from "@/app/pages/PaymentPage";
import ContactPage from "@/app/pages/ContactPage";
import AboutPage from "@/app/pages/AboutPage";

// Admin Pages
import AdminDashboard from "@/app/pages/admin/AdminDashboard";
import AddHotelPage from "@/app/pages/admin/AddHotelPage";
import AddRoomPage from "@/app/pages/admin/AddRoomPage";
import ManageRoomsPage from "@/app/pages/admin/ManageRoomsPage";

// Super Admin Pages
import SuperAdminLogin from "@/app/pages/SuperAdminLogin";
import MasterAdminDashboard from "@/app/pages/MasterAdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/hotels" element={<HotelListingPage />} />
              <Route path="/hotel/:id" element={<SpecificHotelPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />

              {/* User Routes */}
              <Route path="/bookings" element={<MyBookingsPage />} />
              <Route path="/payment/:id" element={<PaymentPage />} />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/add-hotel"
                element={
                  <AdminRoute>
                    <AddHotelPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/add-room"
                element={
                  <AdminRoute>
                    <AddRoomPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/manage-rooms"
                element={
                  <AdminRoute>
                    <ManageRoomsPage />
                  </AdminRoute>
                }
              />

              {/* Super Admin Routes - Hidden, not in navbar */}
              <Route path="/super-admin-login" element={<SuperAdminLogin />} />
              <Route
                path="/master-admin-dashboard"
                element={
                  <RoleRoute allowedRole="masterAdmin">
                    <MasterAdminDashboard />
                  </RoleRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </AppProvider>
    </BrowserRouter>
  );
}
