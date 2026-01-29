import React from "react";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-500 pt-12 pb-6 border-t border-gray-200">
      <div className="container mx-auto px-6">
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Shop */}
          <div>
            <h3 className="text-gray-900 font-semibold text-lg mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                {/* <a href="#" className="hover:text-gray-700">Oversize T-Shirt</a> */}
              </li>
              <li>
                {/* <a href="#" className="hover:text-gray-700">Relaxfit T-Shirt</a> */}
              </li>
              <li>
                <a href="/hoodies" className="hover:text-gray-700">Hoodies</a>
              </li>
              <li>
                <a href="/accessories" className="hover:text-gray-700">Accessories</a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-gray-900 font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="hover:text-gray-700">About Us</a>
              </li>
              <li>
                {/* <a href="#" className="hover:text-gray-700">Careers</a> */}
              </li>
              <li>
                <a href="/blog" className="hover:text-gray-700">Blog</a>
              </li>
              <li>
                {/* <a href="#" className="hover:text-gray-700">Press</a> */}
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-gray-900 font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="/help-center" className="hover:text-gray-700">Help Center</a>
              </li>
              <li>
                <a href="/contact" className="hover:text-gray-700">Contact Us</a>
              </li>
              {/* <li>
                <a href="#" className="hover:text-gray-700">Shipping</a>
              </li> */}
              <li>
                <a href="/privacy-policy" className="hover:text-gray-700">Privacy Policy</a>
              </li>
              <li>
                <a href="/shipping-policy" className="hover:text-gray-700">Shipping Policy</a>
              </li>
              <li>
                <a href="/terms-conditions" className="hover:text-gray-700">Terms & Conditions</a>
              </li>
              <li>
                <a href="/cancellation-refund" className="hover:text-gray-700">Cancellation & Refund</a>
              </li>
            </ul>
          </div>

          {/* Newsletter / Social */}
          <div>
            <h3 className="text-gray-900 font-semibold text-lg mb-4">Stay Connected</h3>
            {/* <p className="text-sm mb-3">
              Subscribe to get special offers, free giveaways, and updates.
            </p>
            <div className="flex flex-col sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full sm:flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 sm:mb-0 sm:mr-2"
              />
              <button className="bg-gray-600 px-4 py-2 text-white rounded-md hover:bg-gray-700">
                Subscribe
              </button>
            </div> */}
            <div className="flex flex-wrap space-x-4 mt-4 align-center">
              <a href="https://wa.me/917400698069"><FaWhatsapp size={22} className="hover:text-gray-700" /></a>
              <a href="https://www.instagram.com/_lofr.in?igsh=cDZ6bDRjaGt5ZHEz"><Instagram size={20} className="hover:text-gray-700" /></a>
              {/* <a href="#"><Twitter size={20} className="hover:text-gray-700" /></a> */}
              {/* <a href="#"><Youtube size={20} className="hover:text-gray-700" /></a> */}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-10 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} www.Lofr.in — All rights reserved, Designed & Developed By Abhishek Rajput & Ankit Kushwah
        </div>
      </div>
    </footer>
  );
};

export default Footer;
