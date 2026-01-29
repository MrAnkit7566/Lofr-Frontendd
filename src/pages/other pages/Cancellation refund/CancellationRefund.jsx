// src/pages/CancellationRefundPolicy.jsx
import React from "react";
import { motion } from "framer-motion";

const CancellationRefundPolicy = () => {
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
          src="/refund-banner.jpg"
          alt="Cancellation and Refund Policy"
          className="w-full max-h-80 object-cover rounded-2xl mb-8 shadow-md"
        /> */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Cancellation & Refund Policy
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We value your satisfaction. This Cancellation & Refund Policy explains
          how we handle order cancellations, returns, and refunds to ensure a
          smooth shopping experience.
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
            1. Order Cancellation
          </h2>
          <p>
            You can cancel your order within <strong>24 hours</strong> of placing it,
            provided it has not been shipped. Once the order is shipped, it
            cannot be cancelled. To request a cancellation, please contact us at{" "}
            <a href="mailto:Lofrfashion@gmail.com" className="text-blue-600 underline">
              Lofrfashion@gmail.com
            </a>{" "}
            with your order details.
          </p>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            2. Return Eligibility
          </h2>
          <p>
            Products are eligible for return if they meet the following
            conditions:
          </p>
          <ul className="list-disc list-inside mt-2">
            <li>The item is unused and in its original condition.</li>
            <li>All tags, packaging, and accessories are intact.</li>
            <li>
              The return request is made within <strong>7 days</strong> of
              delivery.
            </li>
          </ul>
          <p className="mt-2">
            Items damaged due to customer misuse or without original packaging
            are not eligible for return.
          </p>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            3. Non-Returnable Items
          </h2>
          <p>
            Certain products are non-returnable for hygiene and safety reasons,
            including but not limited to:
          </p>
          <ul className="list-disc list-inside mt-2">
            {/* <li>Personal care items</li> */}
            {/* <li>Undergarments</li> */}
            <li>Customized or made-to-order products</li>
            {/* <li>Gift cards or digital products</li> */}
          </ul>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            4. Refund Process
          </h2>
          <p>
            Once your return is received and inspected, we will notify you of
            the approval or rejection of your refund. Approved refunds will be
            processed within <strong>7–10 business days</strong> to your original
            payment method.
          </p>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            5. Late or Missing Refunds
          </h2>
          <p>
            If you haven’t received a refund within the mentioned time, please
            check your bank account or contact your payment provider. If you
            still haven’t received it, contact us at{" "}
            <a href="mailto:Lofrfashion@gmail.com" className="text-blue-600 underline">
              Lofrfashion@gmail.com
            </a>
            .
          </p>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            6. Exchange Policy
          </h2>
          <p>
            We currently do not offer direct product exchanges. If you wish to
            replace an item, please initiate a return and place a new order for
            the desired product.
          </p>
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            7. Damaged or Incorrect Items
          </h2>
          <p>
            If you receive a damaged or incorrect item, please contact us within{" "}
            <strong>48 hours</strong> of delivery with photos of the product and
            packaging. We will arrange a replacement or issue a refund after
            verification.
          </p>
        </section>

        {/* Section 8 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            8. Contact Us
          </h2>
          <p>
            For any cancellation, return, or refund-related concerns, please
            contact our support team at{" "}
            <a href="mailto:Lofrfashion@gmail.com" className="text-blue-600 underline">
              Lofrfashion@gmail.com
            </a>
            .
          </p>
        </section>
      </motion.div>
    </div>
  );
};

export default CancellationRefundPolicy;
