// Banner.jsx
import React from "react";
import { motion } from "framer-motion";
import BannerImage from "../../../assets/banner1.jpeg"; // Replace with your image path
import { useNavigate } from "react-router-dom"; // ✅ Import navigate hook

const Banner1 = () => {
  const navigate = useNavigate(); // ✅ Initialize navigate

  return (
    <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 md:px-0">
        {/* Text content */}
        <motion.div
          className="md:w-1/2"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Elevate Your Style
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Trendy T-shirts made with comfort and quality in mind. Shop now and
            upgrade your wardrobe.
          </p>

          {/* ✅ Shop Now Button with Navigate */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-indigo-600 font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
            onClick={() => navigate("/new")} // ✅ Navigate to home page
          >
            Shop Now
          </motion.button>
        </motion.div>

        {/* Image */}
        <motion.div
          className="md:w-1/2 mt-10 md:mt-0"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <img
            src={BannerImage}
            alt="Banner"
            className="w-full h-auto rounded-lg shadow-xl"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Banner1;
