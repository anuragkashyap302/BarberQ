import React from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Banner = () => {
    const navigate = useNavigate();
  return (
    <section className=" mt-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="bg-pink-500 text-white rounded-2xl py-12 px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Left Content */}
          <div className="flex-1">
            <h2 className="text-4xl font-bold leading-snug">
              Book Your Grooming Appointment <br /> With <span className="text-yellow-300">Top Barbers</span>
            </h2>
            <p className="mt-4 text-lg text-pink-100">
              Choose your preferred barber and time slot — quick, easy, and professional service just for you.
            </p>
            <button onClick={()=> {navigate('/login'); scrollTo(0,0)}}  className="mt-6 bg-white text-pink-600 font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-pink-100 transition-all cursor-pointer">
              Create Account
            </button>
          </div>

          {/* Right Image */}
          <div className="flex-1 flex justify-center">
            <img 
              src={assets.appointment_img} 
              alt="Banner" 
              className="w-full max-w-sm rounded-lg shadow-lg object-cover"
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Banner;
