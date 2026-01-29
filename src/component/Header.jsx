import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, User, LogOut, LogIn } from "lucide-react";
import brand from '/logo1.png';
import { FaRegHeart } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { getCart } from "../service/cartServices";
import { useWishlist } from "../context/wishListContext";

const Header = () => {
  const [cartCount, setCartCount] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  let { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  // Update cart count
  const updateCartCount = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return setCartCount(0);

      const res = await getCart(userId);
      const items = res.data.cart?.items || [];
      setCartCount(items.length);
      localStorage.setItem("cartCount", items.length);
    } catch (err) {
      // console.error("Failed to update cart count:", err);
      setCartCount(0);
    }
  };

  useEffect(() => {
    const cached = localStorage.getItem("cartCount");
    if (cached) setCartCount(parseInt(cached));

    updateCartCount();

    const handleCartUpdated = () => updateCartCount();
    window.addEventListener("cartUpdated", handleCartUpdated);
    window.addEventListener("storage", handleCartUpdated);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated);
      window.removeEventListener("storage", handleCartUpdated);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("cartCount");
    setCartCount(0);
    navigate("/login");
  };

  const navLinks = [
    { name: "T-Shirts", path: "/category/tshirts" },
    { name: "Hoodies", path: "/hoodies" },
    { name: "Accessories", path: "/accessories" },
    // { name: "Sneakers", path: "/category/sneakers" },
    // { name: "Sale", path: "/category/sale" },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="sticky top-0 z-50 bg-gray-50 backdrop-blur-sm border-b border-gray-200"
    >
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <div onClick={() => navigate("/")} className="cursor-pointer flex items-center">
          <img src={brand} alt="Logo" className="w-32 md:w-36 mt-2.5" />
        </div>

        {/* Cart + Profile */}
        <div className="flex items-center space-x-4">
          {/* Wishlist */}
          <div className="relative">
            <button
              onClick={() => navigate("/wishlist")}
              className="p-2 rounded-full cursor-pointer hover:bg-gray-100 relative"
            >
              <FaRegHeart className="w-6 h-6 text-gray-700" />
              <AnimatePresence>
                {wishlistCount > 0 && (
                  <motion.span
                    key={wishlistCount}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute -top-1 -right-1 bg-red-600 text-white text-[11px] font-semibold rounded-full h-4 w-4 flex items-center justify-center shadow"
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* Cart */}
          <div className="relative">
            <button
              onClick={() => navigate("/cart")}
              className="p-2 rounded-full hover:bg-gray-100 relative"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute -top-1 -right-1 bg-red-600 text-white text-[11px] font-semibold rounded-full h-4 w-4 flex items-center justify-center shadow"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* Profile */}
          <div
            className="relative"
            onMouseEnter={() => setShowProfileMenu(true)}
            onMouseLeave={() => setShowProfileMenu(false)}
          >
            <button className="p-2 rounded-full hover:bg-gray-100">
              <User className="w-6 h-6 text-gray-700" />
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden z-50"
                >
                  {!token ? (
                    <button
                      onClick={() => navigate("/login")}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                    >
                      <LogIn className="w-4 h-4" /> Login / Register
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => navigate("/profile")}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User className="w-4 h-4" /> Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white border-t border-gray-100">
        <div className="container mx-auto flex items-center justify-center md:justify-start gap-6 py-2 text-sm font-medium text-gray-500">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => navigate(link.path)}
              className={`hover:text-gray-700 transition ${
                location.pathname === link.path
                  ? "text-blue-600 font-semibold"
                  : ""
              }`}
            >
              {link.name}
            </button>
          ))}
        </div>
      </nav>
    </motion.header>
  );
};

export default Header;
