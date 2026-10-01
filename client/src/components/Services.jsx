import React, { useContext } from 'react';
import { FaCut, FaUserTie, FaSpa, FaTint, FaChild, FaHandSparkles, FaHotTub } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { ServicesGridSkeleton } from './SkeletonLoaders'; // Hindi Comment: Skeleton placeholder component import kiya

const Services = () => {
  // Hindi Comment: Services array, loading indicator aur getServicesData function AppContext se liya
  const { services, isServicesLoading, getServicesData } = useContext(AppContext);

  // Yeh function service name ke hisab se premium logo/icon choose karta hai
  // photo bhi use kar sakte hain icon ke jagah just name ke hisab se
  const getServiceIcon = (name) => {
    const title = name.toLowerCase();
    if (title.includes("kids") || title.includes("child")) {
      return <FaChild size={40} className="text-pink-400" />;
    }
    if (title.includes("color") || title.includes("dye") || title.includes("highlight")) {
      return <FaTint size={40} className="text-pink-400" />;
    }
    if (title.includes("manicure") || title.includes("pedicure") || title.includes("nail") || title.includes("hand")) {
      return <FaHandSparkles size={40} className="text-pink-400" />;
    }
    if (title.includes("hair spa") || title.includes("treatment")) {
      return <FaHotTub size={40} className="text-pink-400" />;
    }
    if (title.includes("massage") || title.includes("spa") || title.includes("facial")) {
      return <FaSpa size={40} className="text-pink-400" />;
    }
    if (title.includes("beard") || title.includes("groom") || title.includes("shave") || title.includes("tie")) {
      return <FaUserTie size={40} className="text-pink-400" />;
    }
    if (title.includes("cut") || title.includes("style") || title.includes("hair")) {
      return <FaCut size={40} className="text-pink-400" />;
    }
    return <FaCut size={40} className="text-pink-400" />; // default icon
  };

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
          {isServicesLoading ? (
            // Hindi Comment: Server se data fetch hote samay 9 pulsing skeleton cards render honge
            <ServicesGridSkeleton count={9} />
          ) : services.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white/5 border border-white/10 rounded-2xl">
              <p className="text-gray-400 mb-4">No services available right now.</p>
              <button 
                onClick={getServicesData} 
                className="px-6 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-full text-sm font-semibold transition cursor-pointer"
              >
                Retry
              </button>
            </div>
          ) : (
            services.map((service, index) => (
              <div
                key={service._id || index}
                className="bg-gray-800/80 backdrop-blur-md border border-gray-700 shadow-lg rounded-xl p-6 text-center hover:shadow-pink-500/20 hover:-translate-y-1 transition duration-300"
              >
                <div className="flex justify-center mb-4">
                  {getServiceIcon(service.name)}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{service.name}</h3>
                <p className="text-gray-300 mb-4">{service.description}</p>

                <Link
                  to={`/barbers/${encodeURIComponent(service.name)}`}
                  onClick={() => window.scrollTo(0, 0)}
                  className="inline-block mt-4 bg-pink-500 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-pink-600 transition-transform transform hover:scale-105"
                >
                  Book Now
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Services;
