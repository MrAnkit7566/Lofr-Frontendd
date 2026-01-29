import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Headphones, Mail, Phone } from "lucide-react";

const HelpCenter = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: "Orders & Tracking",
      questions: [
        {
          q: "How do I place an order?",
          a: "Browse our T-shirts, select your size, and click 'Add to Cart'. Proceed to checkout and complete payment to confirm your order.",
        },
        {
          q: "How can I track my order?",
          a: "After placing your order, you'll receive a tracking link via email or SMS to follow your shipment status in real-time.",
        },
        {
          q: "Can I cancel or change my order?",
          a: "Orders can be modified or canceled within 2 hours of placing them by contacting our support team.",
        },
      ],
    },
    {
      category: "Shipping & Delivery",
      questions: [
        {
          q: "What are the delivery charges?",
          a: "We offer free shipping on all prepaid orders across India.",
        },
        {
          q: "How long will delivery take?",
          a: "Orders are usually delivered within 3–7 business days depending on your location.",
        },
        {
          q: "Do you deliver everywhere in India?",
          a: "Yes! We deliver to most pin codes across India through our reliable courier partners.",
        },
      ],
    },
    {
      category: "Payments",
      questions: [
        {
          q: "What payment methods do you accept?",
          a: "We accept UPI, Debit/Credit Cards, Net Banking, and Cash on Delivery (COD).",
        },
        {
          q: "Is online payment safe?",
          a: "Yes, your payment information is encrypted and processed securely via trusted gateways.",
        },
      ],
    },
    {
      category: "Returns & Refunds",
      questions: [
        {
          q: "What is your return policy?",
          a: "You can return unworn, unwashed products within 7 days of delivery.",
        },
        {
          q: "How do I return a product?",
          a: "Go to your account → Orders → Select item → Click 'Return'. Our courier partner will pick it up.",
        },
        {
          q: "When will I get my refund?",
          a: "Refunds are processed within 5–7 business days after we receive the returned item.",
        },
      ],
    },
    {
      category: "Products & Sizes",
      questions: [
        {
          q: "How do I find my size?",
          a: "Use our Size Guide available on each product page to find your perfect fit.",
        },
        {
          q: "Are your T-shirts shrink-proof?",
          a: "Yes, all our T-shirts are pre-washed and made from high-quality cotton to prevent shrinkage.",
        },
        {
          q: "Do you restock sold-out items?",
          a: "Yes! Popular designs are restocked regularly — subscribe to our newsletter for updates.",
        },
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Help Center</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Have questions? We’re here to help! Check our FAQs or reach out to our
          friendly support team anytime.
        </p>
      </motion.div>

      {/* FAQs */}
      {faqs.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {section.category}
          </h2>
          <div className="space-y-3">
            {section.questions.map((item, i) => {
              const index = `${sectionIndex}-${i}`;
              const isOpen = openIndex === index;
              return (
                <motion.div
                  key={index}
                  className="border border-gray-200 rounded-xl bg-white/70 shadow-sm"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full flex justify-between items-center px-5 py-3 text-left font-medium text-gray-800"
                  >
                    {item.q}
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-5 pb-4 text-gray-600"
                      >
                        {item.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Contact Support Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-14 bg-gray-50 border rounded-2xl shadow-sm p-8 text-center"
      >
        <h3 className="text-2xl font-semibold text-gray-900 mb-3">
          Still Need Help?
        </h3>
        <p className="text-gray-600 mb-6">
          Contact our support team — we’ll get back to you as soon as possible.
        </p>

        <div className="flex flex-wrap justify-center gap-6 text-gray-700">
          {/* Email */}
          <a
            href="mailto:Lofrfashion@gmail.com"
            className="flex items-center gap-2 hover:text-blue-600 transition-colors"
          >
            <Mail className="w-5 h-5 text-blue-600" />
            <span>Lofrfashion@gmail.com</span>
          </a>

          {/* Phone */}
          <a
            href="tel:+917400698069"
            className="flex items-center gap-2 hover:text-green-600 transition-colors"
          >
            <Phone className="w-5 h-5 text-green-600" />
            <span>+91-7400698069</span>
          </a>

          {/* Working Hours */}
          <div className="flex items-center gap-2">
            <Headphones className="w-5 h-5 text-purple-600" />
            <span>Mon–Sat: 10 AM – 6 PM</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HelpCenter;
