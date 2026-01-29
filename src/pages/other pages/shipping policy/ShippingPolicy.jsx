// src/pages/ShippingPolicy.jsx
import React from "react";
import { motion } from "framer-motion";

const ShippingPolicy = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-16 px-6 md:px-12 lg:px-24">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        {/* <img
          src="/shipping-banner.jpg"
          alt="Shipping Policy"
          className="w-full max-h-80 object-cover rounded-2xl mb-8 shadow-md"
        /> */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Shipping Policy
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          This Shipping Policy explains how and when your orders are processed,
          shipped, and delivered when you make a purchase on our website.
        </p>
      </motion.div>

      {/* Policy Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-white shadow-md rounded-2xl p-8 md:p-12 max-w-5xl mx-auto space-y-8 text-gray-700 leading-relaxed"
      >
        {/* Section 1 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            1. Order Processing
          </h2>
          <p>
            Orders are typically processed within <strong>1-3 business days</strong> after
            payment confirmation. Orders placed on weekends or holidays will be
            processed on the next working day.
          </p>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            2. Shipping Methods & Delivery Time
          </h2>
          <p>
            We offer standard and express delivery options depending on your
            location. Delivery times may vary based on your address and the
            courier partner’s serviceability.
          </p>
          <ul className="list-disc list-inside mt-2">
            <li>Standard Delivery: 5–7 business days</li>
            <li>Express Delivery: 2–4 business days</li>
            <li>Rural Areas: May take additional time</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            3. Shipping Charges
          </h2>
          <p>
            Shipping charges are calculated at checkout based on order weight,
            delivery location, and chosen delivery method. Occasionally, we may
            offer <strong>free shipping</strong> on promotional orders.
          </p>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            4. Order Tracking
          </h2>
          <p>
            Once your order is shipped, you will receive a confirmation email
            or SMS with tracking details. You can track your order status on our
            website using your tracking number.
          </p>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            5. Delayed or Lost Shipments
          </h2>
          <p>
            While we ensure timely delivery, delays may occur due to unforeseen
            circumstances like weather, courier delays, or logistics issues. If
            your order is significantly delayed, please contact us for support.
          </p>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            6. Incorrect Address
          </h2>
          <p>
            Please ensure your shipping address is accurate at checkout. We are
            not responsible for failed deliveries due to incorrect or incomplete
            address details provided by the customer.
          </p>
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            7. International Shipping
          </h2>
          <p>
            Currently, we only ship within India. We plan to expand our shipping
            services internationally in the future.
          </p>
        </section>

        {/* Section 8 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            8. Contact Us
          </h2>
          <p>
            For any shipping-related questions or support, feel free to contact
            our team at{" "}
            <a
              href="mailto:Lofrfashion@gmail.com"
              className="text-blue-600 underline"
            >
              Lofrfashion@gmail.com
            </a>
            .
          </p>
        </section>
      </motion.div>
    </div>
  );
};

export default ShippingPolicy;
