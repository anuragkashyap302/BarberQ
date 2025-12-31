import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { BarberContext } from '../context/BarberContext'

const Sidebar = () => {
  const { aToken } = useContext(AdminContext)
  const { bToken } = useContext(BarberContext)

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 font-medium
     ${isActive 
        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-purple-500/40' 
        : 'text-gray-300 hover:bg-white/10 hover:text-pink-400'}`

  return (
    <div className="h-screen w-64 bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f172a] p-4 border-r border-white/10 shadow-xl">
      {aToken && (
        <ul className="flex flex-col gap-3 mt-6">
          <NavLink to="/admin-dashboard" className={linkClass}>
            <img src={assets.home_icon} alt="" className="w-5 h-5" />
            <p className='hidden md:block'>Dashboard</p>
          </NavLink>

          <NavLink to="/all-booking" className={linkClass}>
            <img src={assets.appointment_icon} alt="" className="w-5 h-5" />
            <p className='hidden md:block'>Bookings</p>
          </NavLink>

          <NavLink to="/add-barber" className={linkClass}>
            <img src={assets.add_icon} alt="" className="w-5 h-5" />
            <p className='hidden md:block'>Add Barber</p>
          </NavLink>

          <NavLink to="/barber-list" className={linkClass}>
            <img src={assets.people_icon} alt="" className="w-5 h-5" />
            <p className='hidden md:block'>Barber List</p>
          </NavLink>
        </ul>
      )}
       {bToken && (
        <ul className="flex flex-col gap-3 mt-6">
          <NavLink to="/barber-dashboard" className={linkClass}>
            <img src={assets.home_icon} alt="" className="w-5 h-5" />
            <p className='hidden md:block'>Dashboard</p>
          </NavLink>

          <NavLink to="/barber-bookings" className={linkClass}>
            <img src={assets.appointment_icon} alt="" className="w-5 h-5" />
            <p className='hidden md:block'>Bookings</p>
          </NavLink>


          <NavLink to="/barber-profile" className={linkClass}>
            <img src={assets.people_icon} alt="" className="w-5 h-5" />
            <p className='hidden md:block'>Profile</p>
          </NavLink>
        </ul>
      )}
    </div>
  )
}

export default Sidebar
