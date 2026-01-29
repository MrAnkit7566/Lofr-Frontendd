// src/pages/TermsAndConditions.jsx
import React from "react";
import { motion } from "framer-motion";

const TermsAndConditions = () => {
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
          src="/terms-banner.jpg"
          alt="Terms and Conditions"
          className="w-full max-h-80 object-cover rounded-2xl mb-8 shadow-md"
        /> */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Terms & Conditions
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Please read these terms and conditions carefully before using our
          website or making any purchase. By accessing or using our website, you
          agree to be bound by these terms.
        </p>
      </motion.div>

      {/* Terms Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-white shadow-md rounded-2xl p-8 md:p-12 max-w-5xl mx-auto space-y-8 text-gray-700 leading-relaxed"
      >
        {/* Section 1 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing our website or purchasing our products, you acknowledge
            that you have read, understood, and agree to these Terms &
            Conditions and our Privacy Policy.
          </p>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            2. Use of Our Website
          </h2>
          <p>
            You agree to use our website for lawful purposes only. You must not
            misuse or attempt to harm our website by introducing viruses or
            malicious code, or by engaging in fraudulent activity.
          </p>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            3. Product Information
          </h2>
          <p>
            We make every effort to ensure accurate product descriptions and
            images. However, minor variations in color or texture may occur due
            to screen differences or product updates.
          </p>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            4. Pricing & Payment
          </h2>
          <p>
            All prices are listed in INR (₹) and include applicable taxes unless
            stated otherwise. We reserve the right to modify prices at any time
            without prior notice. Payments are processed securely through trusted
            third-party gateways.
          </p>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            5. Shipping & Delivery
          </h2>
          <p>
            Shipping timelines are provided in our Shipping Policy. We are not
            responsible for delays caused by courier services or unforeseen
            circumstances beyond our control.
          </p>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            6. Return & Refund Policy
          </h2>
          <p>
            Returns and refunds are subject to the terms mentioned in our Return
            & Refund Policy. Items must be unused, in original packaging, and
            returned within the specified time period.
          </p>
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            7. Intellectual Property
          </h2>
          <p>
            All content on this website, including logos, images, designs, and
            text, are the property of our brand and protected by copyright laws.
            Unauthorized use or reproduction is strictly prohibited.
          </p>
        </section>

        {/* Section 8 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            8. Limitation of Liability
          </h2>
          <p>
            We are not liable for any direct or indirect damages arising from
            the use or inability to use our website, products, or services.
          </p>
        </section>

        {/* Section 9 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            9. Changes to Terms
          </h2>
          <p>
            We may update these Terms & Conditions at any time. Updates will be
            reflected on this page with a revised effective date.
          </p>
        </section>

        {/* Section 10 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            10. Contact Us
          </h2>
          <p>
            If you have any questions regarding these Terms & Conditions, please
            contact us at{" "}
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

export default TermsAndConditions;
