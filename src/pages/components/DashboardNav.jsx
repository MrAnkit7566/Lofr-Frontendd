import React, { useState } from "react";
import { ChevronDown } from "lucide-react"; // Optional icon for dropdown
import Logo from "../../../public/logo1.png"; // Replace with your logo path
import { FaRegUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


export function DashboardNav() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate()


   const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("cartCount");
    navigate("/login");
  };

  const handleViewProfile = () => {
    console.log("Viewing profile...");
    // Add navigation to profile page here
  };

  return (
    <nav className="flex justify-between items-center bg-gray-100 px-6  shadow-md">
      {/* Left Side - Logo */}
      <div className="flex items-center">
        <img
          src={Logo} // Replace with your logo path
          alt="Brand Logo"
          className="h-20 w-20 mr-2"
        />
        <span className="font-bold text-lg">Admin Panel</span>
      </div>

      {/* Right Side - Profile */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center space-x-2 focus:outline-none cursor-pointer"
        >
         <FaRegUser size={20}/>
          {/* <ChevronDown className="w-4 h-4" /> */}
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-10">
            <button
              onClick={handleViewProfile}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              View Profile
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
