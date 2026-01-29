import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ShippingForm = ({ onSubmit = (data) => console.log("Form submitted:", data) }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    phone: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = [
      "full_name",
      "address_line1",
      "city",
      "state",
      "postal_code",
      "country",
      "phone",
    ];

    for (let field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill in ${field.replace("_", " ")}`);
        return;
      }
    }

    toast.success("✅ Shipping information saved!");
    onSubmit(formData);
    navigate("/checkout/shipping-method"); // optional next step
  };

  const inputFields = [
    { name: "full_name", label: "Full Name", required: true },
    { name: "phone", label: "Phone Number", required: true },
    { name: "address_line1", label: "Address Line 1", required: true },
    { name: "address_line2", label: "Address Line 2", required: false },
    { name: "city", label: "City", required: true },
    { name: "state", label: "State", required: true },
    { name: "postal_code", label: "Postal Code", required: true },
    { name: "country", label: "Country", required: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-xl mt-10"
    >
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
        🚚 Shipping Information
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
      >
        {inputFields.map((field) => (
          <div key={field.name} className="relative group">
            <input
              type="text"
              id={field.name}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              required={field.required}
              className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder={field.label}
            />
            <label
              htmlFor={field.name}
              className="absolute left-3 top-2.5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2.5 peer-focus:text-sm peer-focus:text-blue-600"
            >
              {field.label}
              {!field.required && (
                <span className="text-gray-400"> (Optional)</span>
              )}
            </label>
          </div>
        ))}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="col-span-2 mt-4 bg-gradient-to-r  from-blue-600 to-blue-500 text-white cursor-pointer font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition"
        >
          Continue to Checkout →
        </motion.button>
      </form>
    </motion.div>
  );
};

export default ShippingForm;
