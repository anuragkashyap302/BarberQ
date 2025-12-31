import React from 'react';
import { FaCut, FaUserTie, FaSpa } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Services = () => {
  const services = [
    {
      icon: <FaCut size={40} className="text-pink-400" />,
      title: "Haircut & Styling",
      desc: "Professional haircuts tailored to your style, handled by skilled barbers."
    },
    {
      icon: <FaUserTie size={40} className="text-pink-400" />,
      title: "Beard Grooming",
      desc: "Keep your beard sharp and stylish with precision trimming."
    },
    {
      icon: <FaSpa size={40} className="text-pink-400" />,
      title: "Facial & Spa",
      desc: "Relax and refresh with our premium facial and spa treatments."
    },
  ];

  return (
    <section className="relative py-20" id="services">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <h2 className="text-3xl font-bold text-center text-white mb-4">
          Our <span className="text-pink-500">Services</span>
        </h2>
        <p className="text-gray-300 text-center max-w-2xl mx-auto mb-12">
          At <span className="font-semibold text-pink-400">BarberQ</span>, we provide top-notch grooming services to keep you looking your best. 
          Book online and skip the wait.
        </p>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-gray-800/80 backdrop-blur-md border border-gray-700 shadow-lg rounded-xl p-6 text-center hover:shadow-pink-500/20 hover:-translate-y-1 transition duration-300"
            >
              <div className="flex justify-center mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-white">{service.title}</h3>
              <p className="text-gray-300 mb-4">{service.desc}</p>

              {/* ✅ Use Link instead of button */}
              <Link
                to={`/barbers/${encodeURIComponent(service.title)}`}
                onClick={() => window.scrollTo(0, 0)}
                className="inline-block mt-4 bg-pink-500 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-pink-600 transition-transform transform hover:scale-105"
              >
                Book Now
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
