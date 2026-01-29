import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";

// Components
import ProtectedAdminRoute from "./pages/components/ProtectedAdminRoute";
import ProtectedRoute from "./component/ProtectedRoute";
import Header from "./component/Header";
import Footer from "./component/Footer";
import SaleBar from "./pages/sales/SaleBar";

// Pages
import Signup from "./pages/Auth/Signup";
import LogIn from "./pages/Auth/Login";
import Dashboard from "./pages/Admin/Dashboard";
import LandingPage from "./pages/LandingPages/LandingPage";
import Cart from "./pages/AddToCart/Cart";
import Products from "./pages/productPages/Product";
import UserProfile from "./pages/profile/UserProfile";
import Wishlist from "./pages/wishlist/Wishlist";
import Order from "./pages/order/Order";
import Checkout from "./pages/order/Checkout";
import AboutPage from "./pages/other pages/about/AboutPage";
import Blog from "./pages/other pages/blog/Blog";
import PrivacyPolicy from "./pages/other pages/privacy policy/PrivacyPolicy";
import HelpCenter from "./pages/other pages/help center/HelpCenter";
import ContactUs from "./pages/other pages/contsct us/ContactUs";
import Hoodies from "./pages/Hoodies/Hoodies";
import Accessory from "./pages/Accessories/Accessory";
import ShippingPolicy from "./pages/other pages/shipping policy/ShippingPolicy";
import TermsAndConditions from "./pages/other pages/terms&Conditions/TermsCondition";
import CancellationRefundPolicy from "./pages/other pages/Cancellation refund/CancellationRefund";


// ✅ Separate AppContent so Router context is available
const AppContent = () => {
  const location = useLocation();

  // ✅ Detect if the current route is an admin page
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {/* ✅ Toast Configuration */}
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        draggable
        pauseOnHover
        theme="light"
      />
      <Toaster toastOptions={{ style: { fontSize: "13px" } }} />

      {/* ✅ Hide Header/Footer/SaleBar on admin routes */}
      {!isAdminRoute && <SaleBar />}
      {!isAdminRoute && <Header />}

      <Routes>
        {/* ✅ Admin Dashboard (Protected) */}
        <Route
          path="/admin/dashboard/*"
          element={
            <ProtectedAdminRoute>
              <Dashboard />
            </ProtectedAdminRoute>
          }
        />

        {/* ✅ Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/hoodies" element={<Hoodies />} />
        <Route path="/accessories" element={<Accessory />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/terms-conditions" element={<TermsAndConditions />} />
        <Route
          path="/cancellation-refund"
          element={<CancellationRefundPolicy />}
        />

        {/* ✅ Product Detail (Protected) */}
        <Route
          path="/product/:id"
          element={
            // <ProtectedRoute>
              <Products />
            // </ProtectedRoute>
          }
        />

        {/* ✅ Protected User Routes */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order"
          element={
            <ProtectedRoute>
              <Order />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        {/* ✅ Default Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* ✅ Footer hidden on admin */}
      {!isAdminRoute && <Footer />}
    </>
  );
};

// ✅ Main App Wrapper
const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
