import React from 'react'
import { useContext } from 'react';

import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';

const TopBarbers = () => {
    const navigate = useNavigate();
    const {barbers} = useContext(AppContext)
    console.log(barbers);
  return (
    <div className=" py-12 px-6 md:px-16 lg:px-36">
      {/* Heading */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white">Top <span className='text-pink-400'>Barbers</span> To Book</h1>
        <p className="text-gray-300 mt-2">
          Simply browse through our extensive list of trusted barbers
        </p>
      </div>

      {/* Barbers Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {barbers.slice(0, 10).map((item, index) => (
          <div onClick={()=>navigate(`/booking/${item._id}`)}
            key={index}
            className="relative group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            {/* Image */}
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300"></div>

            {/* Barber Info */}
            <div className="absolute bottom-0 p-4 text-white">
              <div className="flex items-center justify-evenly text-sm gap-2">
                <p className="font-semibold">{item.name}</p> 
                {item.available ? (
  <span className="bg-green-500 text-white px-2 py-1 rounded-md text-xs m-1">
    Available
  </span>
) : (
  <span className="bg-red-500 text-white px-2 py-1 rounded-md text-xs m-1">
    Not Available
  </span>
)}
              </div>
              <p className="text-gray-300 text-xs mt-1">{item.services}</p>
            </div>
          </div>
        ))}
      </div>

      {/* More Button */}
      <div className="flex justify-center mt-10">
        <button onClick={()=> {navigate('/barbers'); scrollTo(0 ,0)}} className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 cursor-pointer">
          More
        </button>
      </div>
    </div>
  )
}

export default TopBarbers
