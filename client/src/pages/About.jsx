import React from "react";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <section className="py-36 px-6 max-w-7xl mx-auto text-white">
      {/* Top About Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Image */}
        <div className="w-full h-80 rounded-xl overflow-hidden flex items-center justify-center shadow-lg">
          <img
            src={assets.appointment_img}
            alt="about-image"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text Content */}
        <div>
          <h2 className="text-3xl font-bold mb-4">
            About <span className="text-pink-500">Us</span>
          </h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Welcome to <span className="font-semibold">BarberQ</span>, your
            trusted partner in managing your grooming needs effortlessly. At
            BarberQ, we understand how challenging it can be to schedule the
            perfect haircut or grooming session in today’s busy lifestyle.
          </p>
          <p className="text-gray-300 leading-relaxed mb-4">
            BarberQ is committed to providing a seamless experience by
            connecting you with expert barbers and stylists near you. Whether
            it’s your weekly trim, a stylish new look, or preparing for a
            special occasion, we’ve got you covered.
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-2">Our Vision</h3>
          <p className="text-gray-300 leading-relaxed">
            Our vision is to create a modern and convenient grooming experience
            for everyone. We aim to bridge the gap between clients and barbers,
            ensuring you always look and feel your best.
          </p>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="mt-16">
        <h3 className="text-2xl font-bold text-center mb-8">
          Why <span className="text-pink-500">Choose Us</span>
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white/10 p-6 rounded-xl shadow-lg hover:bg-white/20 transition">
            <h4 className="font-bold text-lg mb-2">Efficiency</h4>
            <p className="text-gray-300">
              Quick and easy appointment scheduling that fits into your busy day.
            </p>
          </div>
          {/* Card 2 */}
          <div className="bg-white/10 p-6 rounded-xl shadow-lg hover:bg-white/20 transition">
            <h4 className="font-bold text-lg mb-2">Convenience</h4>
            <p className="text-gray-300">
              Access a network of skilled barbers and stylists near you.
            </p>
          </div>
          {/* Card 3 */}
          <div className="bg-white/10 p-6 rounded-xl shadow-lg hover:bg-white/20 transition">
            <h4 className="font-bold text-lg mb-2">Personalization</h4>
            <p className="text-gray-300">
              Tailored grooming recommendations and reminders so you never miss
              a trim.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
