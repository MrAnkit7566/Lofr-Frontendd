// src/pages/PrivacyPolicy.jsx
import React from "react";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-16 px-6 md:px-12 lg:px-24">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Privacy Policy
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Your privacy is important to us. This page explains how we collect, use, and protect your personal information when you interact with our website or make a purchase.
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
            1. Information We Collect
          </h2>
          <p>
            We collect personal information such as your name, email address, shipping details, and payment information when you make a purchase or sign up for our services.
            We also collect non-personal data like browser type, device info, and site usage analytics to improve your shopping experience.
          </p>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            2. How We Use Your Information
          </h2>
          <p>
            The information we collect is used to process your orders, provide customer support, send updates or promotional offers, and improve our products and services.
            We never sell or rent your data to third parties.
          </p>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            3. Payment Information
          </h2>
          <p>
            All payments made through our website are processed securely by trusted third-party payment gateways such as Razorpay. We do not store or have access to your full payment details such as credit/debit card numbers, CVV, or banking passwords.
            Payment gateways comply with PCI-DSS standards to ensure the highest level of data security.
          </p>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            4. Cookies & Tracking
          </h2>
          <p>
            Our website uses cookies to personalize your experience, remember your cart items, and analyze site performance. You can disable cookies through your browser settings,
            but some features may not function properly.
          </p>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            5. Data Security
          </h2>
          <p>
            We implement strong security measures including encryption and secure servers to protect your personal information. However, please note that no online transmission is 100% secure.
          </p>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            6. Data Retention
          </h2>
          <p>
            We retain your personal data only for as long as necessary to fulfill the purposes described in this policy, comply with legal obligations, resolve disputes, and enforce our agreements.
            Once data is no longer required, it is securely deleted or anonymized.
          </p>
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            7. Third-Party Services
          </h2>
          <p>
            We may use third-party tools like payment gateways, analytics providers, and marketing platforms that have their own privacy policies. We recommend reviewing their policies to understand how your data is handled.
          </p>
        </section>

        {/* Section 8 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            8. User Consent
          </h2>
          <p>
            By using our website, creating an account, or making a purchase, you consent to the collection and use of your personal information as described in this Privacy Policy.
          </p>
        </section>

        {/* Section 9 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            9. Children’s Privacy
          </h2>
          <p>
            Our website is not intended for individuals under the age of 13. We do not knowingly collect personal data from minors. If we learn that we have inadvertently collected information from a child, we will promptly delete it.
          </p>
        </section>

        {/* Section 10 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            10. Your Rights
          </h2>
          <p>
            You have the right to access, correct, or delete your personal data. If you wish to opt out of promotional emails, click the “unsubscribe” link at the bottom of our emails.
          </p>
        </section>

        {/* Section 11 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            11. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy occasionally to reflect changes in our practices. Updates will be posted on this page with the latest revision date.
          </p>
        </section>

        {/* Section 12 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            12. Contact Us
          </h2>
          <p>
            If you have any questions or concerns about our Privacy Policy, please contact us at{" "}
            <a href="mailto:Lofrfashion@gmail.com" className="text-blue-600 underline">
              Lofrfashion@gmail.com
            </a>.
          </p>
        </section>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicy;
