import React from "react";
import { assets } from "../assets/assets";

const Contact = () => {
  return (
    <section className="py-16 px-6 max-w-7xl mx-auto text-white">
      {/* Heading */}
      <h2 className="text-3xl font-bold text-center mb-12 mt-6">
        Contact <span className="text-pink-500">Us</span>
      </h2>

      {/* Contact Grid */}
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Left - Image */}
        <div className="w-full h-96 rounded-xl overflow-hidden shadow-lg">
          <img
            src={assets.appointment_img} // replace with contact image
            alt="contact-image"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right - Info */}
        <div>
          {/* Office Info */}
          <h3 className="text-xl font-semibold mb-4">Our Office</h3>
          <p className="text-gray-300 mb-2">Bhagalpur</p>
          <p className="text-gray-300 mb-2">812004, Bihar, India</p>
          <p className="text-gray-300 mb-2">Tel: (000) 000-0000</p>
          <p className="text-gray-300 mb-6">Email: anuragkumar@gmail.com</p>

          {/* Careers */}
          <h3 className="text-xl font-semibold mb-4">Careers at BarberQ</h3>
          <p className="text-gray-300 mb-6">
            Learn more about our team and job openings.
          </p>

          <button className="px-6 py-3 bg-pink-500 text-white rounded-lg shadow hover:bg-pink-600 transition cursor-pointer">
            Explore Jobs
          </button>
        </div>
      </div>

      {/* Extra - Contact Form */}
      <div className="mt-20">
        <h3 className="text-2xl font-bold text-center mb-8">
          Get In <span className="text-pink-500">Touch</span>
        </h3>
        <form className="max-w-2xl mx-auto grid gap-6">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <textarea
            rows="5"
            placeholder="Your Message"
            className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
          ></textarea>
          <button className="w-full py-3 bg-pink-500 text-white font-semibold rounded-lg shadow hover:bg-pink-600 transition cursor-pointer">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
