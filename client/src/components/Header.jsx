import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
  return (
    <div className='relative h-screen bg-[url("/herobg3.jpg")] bg-cover bg-center'>
      {/* Dark overlay */}
      <div className='absolute inset-0 '></div>

      {/* Content */}
      <div className='relative z-10 flex flex-col justify-center items-start h-full px-6 md:px-16 lg:px-36 text-white max-w-2xl'>

        {/* Heading */}
        <h1 className='text-4xl md:text-5xl font-extrabold leading-tight'>
          Book Your <span className='text-pink-500'>Barber</span> Appointment <br /> Online in Minutes
        </h1>

        {/* Paragraph */}
        <p className='mt-4 text-md md:text-xl text-gray-200'>
          Get a fresh cut, beard trim, or grooming session from the best barbers in town. 
          Easy scheduling, trusted professionals, and top-class service — all at your fingertips.
        </p>

        {/* Button */}
        <a 
          href="#services"
          className='mt-6 inline-flex items-center gap-3 bg-pink-500 hover:bg-pink-600 transition-all px-6 py-3 rounded-full shadow-lg text-lg font-semibold'
        >
          Book Now
          <img src={assets.arrow_icon} alt="Arrow Icon" className='w-5 h-5' />
        </a>

      </div>
    </div>
  )
}

export default Header
