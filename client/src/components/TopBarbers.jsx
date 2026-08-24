import React from 'react'
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';

const TopBarbers = () => {
    const navigate = useNavigate();
    const { barbers } = useContext(AppContext);

    // Sort barbers by rating (descending)
    // Yeh function sabhi barbers ko unki rating ke descending order me sort karta hai
    const sortedBarbers = [...barbers].sort((a, b) => (b.rating || 0) - (a.rating || 0));

  return (
    <div className="py-12 px-6 md:px-16 lg:px-36">
      {/* Heading */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white">Top <span className='text-pink-400'>Barbers</span> To Book</h1>
        <p className="text-gray-300 mt-2">
          Simply browse through our extensive list of trusted barbers ranked by user ratings
        </p>
      </div>

      {/* Barbers Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {sortedBarbers.slice(0, 10).map((item, index) => (
          <div onClick={()=>navigate(`/booking/${item._id}`)}
            key={index}
            className="relative group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
          >
            {/* Image */}
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:bg-black/60 transition-all duration-300"></div>

            {/* Barber Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <div className="flex items-center justify-between text-sm gap-2">
                <p className="font-semibold truncate">{item.name}</p> 
                <span className="flex items-center gap-0.5 bg-yellow-400/90 text-black px-1.5 py-0.5 rounded text-[10px] font-extrabold whitespace-nowrap shadow">
                  ★ {item.rating || "4.5"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs mt-2 text-gray-300">
                <p className="truncate max-w-[65%] font-light">
                  {Array.isArray(item.services) 
                    ? item.services.map(s => s.name).join(", ") 
                    : item.services}
                </p>
                {item.available ? (
                  <span className="text-green-400 text-[10px] font-semibold bg-green-500/10 border border-green-500/20 px-1 rounded">
                    Active
                  </span>
                ) : (
                  <span className="text-red-400 text-[10px] font-semibold bg-red-500/10 border border-red-500/20 px-1 rounded">
                    Busy
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* More Button */}
      <div className="flex justify-center mt-10">
        <button onClick={()=> {navigate('/barbers'); scrollTo(0 ,0)}} className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 cursor-pointer shadow-lg hover:shadow-pink-500/30">
          More
        </button>
      </div>
    </div>
  )
}

export default TopBarbers;
