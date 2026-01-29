// About.jsx
import React from "react";
import { motion } from "framer-motion";
import  Image  from "../../../assets/logo1.jpg"; // replace with your image
import { useNavigate } from "react-router-dom";

const AboutPage = () => {
    const navigate = useNavigate()
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-16">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Wear Your Story
        </h1>
        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
          Trendy T-shirts that speak your style. Comfortable, stylish, and
          made for everyone.
        </p>
      </motion.div>

      {/* Our Story Section */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="grid md:grid-cols-2 gap-10 items-center"
      >
        <img
          src={Image}
          alt="Our Story"
          className="rounded-xl shadow-lg w-full object-cover h-80 md:h-[400px]"
        />
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
          <p className="text-gray-600 text-lg">
            Founded in 2025, <span className="font-semibold">Lofr</span> started with a simple idea: to bring high-quality, stylish, and affordable T-shirts to everyone. Every design tells a story – bold, fun, and full of personality.
          </p>
          <p className="text-gray-600 text-lg">
            We believe your style should express who you are. That’s why we create designs that inspire, empower, and make you feel confident every day.
          </p>
        </div>
      </motion.div>

      {/* Mission Section */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="grid md:grid-cols-2 gap-10 items-center md:flex-row-reverse"
      >
        <img
          src="https://gsbl.in/wp-content/uploads/2023/05/Fashion-Design-GSB-College3.png" // replace with your image
          alt="Our Mission"
          className="rounded-xl shadow-lg w-full object-cover h-80 md:h-[400px]"
        />
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
          <p className="text-gray-600 text-lg">
            To make fashion accessible, comfortable, and exciting. Every T-shirt we design is made with care, keeping both style and comfort in mind.
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Trendy & unique designs</li>
            <li>Soft, durable fabrics</li>
            <li>Affordable for everyone</li>
            <li>Fast delivery & excellent support</li>
          </ul>
        </div>
      </motion.div>

      {/* Vision Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center space-y-6"
      >
        <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          To become a brand loved by T-shirt enthusiasts everywhere, building a community where everyone can express themselves freely through fashion.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
        >
          Shop Now
        </motion.button>
      </motion.div>
    </div>
  );
};

export default AboutPage;
