import React from "react";
import { motion } from "framer-motion";
import { Search, ShoppingCart, User } from "lucide-react";
import Logo from "../../assets/logo1.png";

const Header = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gray-50 backdrop-blur-sm border-b border-gray-200"
    >
      {/* Top Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img src={Logo} alt="Logo" className="w-36 mt-5" />
          </div>

          {/* Right side: Search + Cart + Profile */}
          <div className="flex items-center space-x-4">
            {/* Search bar */}
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search..."
                className="px-4 py-1 pl-10 border border-white bg-white outline-none focus:ring-2 focus:ring-blue-400"
              />
              <Search className="absolute right-3 w-5 h-5 text-gray-500" />
            </div>

            {/* Cart */}
            <button className="p-2 rounded-full hover:bg-gray-100">
              <ShoppingCart className="w-6 h-6 text-gray-700" />
            </button>

            {/* User */}
            <button className="p-2 rounded-full hover:bg-gray-100">
              <User className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-6 h-12 items-center">
            <a href="/" className="text-gray-700 hover:text-blue-600 font-medium">
              Tops
            </a>
            <a href="/Jeans" className="text-gray-700 hover:text-blue-600 font-medium">
              Jeans
            </a>
            <a href="/Shirts" className="text-gray-700 hover:text-blue-600 font-medium">
              Shirts
            </a>
            <a href="/Pants" className="text-gray-700 hover:text-blue-600 font-medium">
              Pants
            </a>
          </nav>
        </div>
      </div>
    </motion.div>
  );
};

export default Header;
