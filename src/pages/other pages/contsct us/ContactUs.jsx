import React, { useState } from "react";
import { motion } from "framer-motion";
import emailjs from "emailjs-com";
import { Mail, Phone, MapPin } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    emailjs
      .send(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        {
          from_name: `${formData.firstName} ${formData.lastName}`,
          from_email: formData.email,
          phone: formData.phone,
          message: formData.message,
        },
        "YOUR_PUBLIC_KEY"
      )
      .then(() => {
        toast.success("Message sent successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message: "",
        });
      })
      .catch(() => toast.error("Failed to send message"))
      .finally(() => setLoading(false));
  };

  return (
    <section className="bg-gray-50 py-16 px-6">
      <Toaster position="top-right" />

      {/* 🔹 Top Info Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 mb-16"
      >
        {/* Card 1 */}
        <div className="flex items-center bg-white rounded-2xl shadow-md p-6 gap-6 hover:shadow-lg transition">
          <img
            src="https://cdn-icons-png.flaticon.com/512/906/906343.png"
            alt="Customer Support"
            className="w-16 h-16 object-contain"
          />
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Customer Support
            </h3>
            <p className="text-gray-600">
              For help with orders, payments, or returns, our support team is
              always ready to assist you.
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="flex items-center bg-white rounded-2xl shadow-md p-6 gap-6 hover:shadow-lg transition">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2089/2089773.png"
            alt="Business Inquiry"
            className="w-16 h-16 object-contain"
          />
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Business Inquiries
            </h3>
            <p className="text-gray-600">
              Want to collaborate or explore business opportunities? Reach out
              to our corporate team.
            </p>
          </div>
        </div>
      </motion.div>

      {/* 🔹 Main Contact Section */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-start">
        {/* Left side - Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gray-900 text-white rounded-2xl p-10 shadow-lg"
        >
          <span className="bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">
            Contact Us
          </span>
          <h2 className="text-3xl font-bold mt-4 mb-4">
            Need More Information? <br /> Get in Touch
          </h2>
          <p className="text-gray-300 mb-8">
            Contact us today for tailored marketing strategies and expert
            advice. We’re eager to help your business grow!
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Phone className="text-gray-300 w-6 h-6" />
              <div>
                <h4 className="font-semibold text-white">Phone Number</h4>
                <p className="text-gray-300">+91 74006 98069</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Mail className="text-gray-300 w-6 h-6" />
              <div>
                <h4 className="font-semibold text-white">Email Address</h4>
                <p className="text-gray-300">Lofrfashion@gmail.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <MapPin className="text-gray-300 w-6 h-6" />
              <div>
                <h4 className="font-semibold text-white">Office Location</h4>
                <p className="text-gray-300">
                  In front of sns school,kante sahab ka bagh sabd pratap ashram
                   Gwalior – 474012, India
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right side - Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-10 rounded-2xl shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-3">Send Message</h2>
          <p className="text-gray-500 mb-8">
            Please fill out the form below with your details and message, and
            our team will get back to you as soon as possible.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name*"
                className="border p-3 rounded-lg "
                value={formData.firstName}
                onChange={handleChange}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="border p-3 rounded-lg "
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="email"
                name="email"
                placeholder="Email*"
                className="border p-3 rounded-lg "
                value={formData.email}
                onChange={handleChange}
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                className="border p-3 rounded-lg  "
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <textarea
              name="message"
              rows="5"
              placeholder="Write Message"
              className="w-full border p-3 rounded-lg "
              value={formData.message}
              onChange={handleChange}
            ></textarea>

            <motion.button
              type="submit"
              whileTap={{ scale: 0.95 }}
              disabled={loading}
              className="bg-gray-700 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition w-full"
            >
              {loading ? "Sending..." : "Send Message"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactUs;
