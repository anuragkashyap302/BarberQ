import React from "react";
import { assets } from "../assets/assets"; // make sure your logo is here

const Footer = () => {
  return (
    <footer className=" text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Logo & About */}
        <div>
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-1 text-yellow-300 drop-shadow-[0_0_4px_rgba(255,191,73,0.8)]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9.828 14.828a4 4 0 015.656 0l2.828 2.828a4 4 0 11-5.656 5.656l-2.828-2.828a4 4 0 010-5.656zM4 2a1 1 0 000 2h.586l7.707 7.707a5.978 5.978 0 00-.83 1.457L4 5.414V6a1 1 0 102 0V4a1 1 0 00-1-1H4zm17 0a1 1 0 010 2h-.586l-5.707 5.707a5.978 5.978 0 00-.83-1.457L20 5.414V6a1 1 0 102 0V4a1 1 0 00-1-1h.586z"/>
      </svg>
            <h2 className="text-2xl font-bold">BarberQ</h2>
          </div>
          <p className="mt-4 text-gray-300 leading-relaxed">
            BarberQ is your trusted platform to book grooming appointments with
            top-rated barbers in your area. Look sharp, feel confident, and skip
            the wait!
          </p>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-gray-300">
            <li><a href="/" className="hover:text-white transition">Home</a></li>
            <li><a href="/about" className="hover:text-white transition">About Us</a></li>
            <li><a href="/services" className="hover:text-white transition">Services</a></li>
            <li><a href="/privacy" className="hover:text-white transition">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
          <ul className="space-y-2 text-gray-300">
            <li>📞 598495830958</li>
            <li>📧 contact@barberq.com</li>
            <li>📍 123 Barber Street, Grooming City</li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="mt-12 border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} BarberQ. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

