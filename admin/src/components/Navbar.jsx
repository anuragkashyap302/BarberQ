import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'
import { BarberContext } from '../context/BarberContext'

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext)
  const {bToken , setBToken} = useContext(BarberContext)
  const navigate =  useNavigate()

  const logout = () => {
    
        navigate('/')
     aToken && setAToken('')
     aToken && localStorage.removeItem('aToken')
     bToken && setBToken('')
     bToken && localStorage.removeItem('bToken')
  }

  return (
    <nav className="w-full bg-[#0f172a]/60 backdrop-blur-lg border-b border-white/10 px-6 py-3.5 flex items-center justify-between shadow-lg sticky top-0 z-50">
      {/* Logo + Role */}
      <div className="flex items-center gap-3">
        {/* BarberQ Brand Logo */}
        <div
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <img
            src="/logo.png"
            alt="BarberQ"
            className="w-10 h-10 rounded-xl object-cover shadow-[0_0_15px_rgba(236,72,153,0.4)] border border-amber-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"
          />
          <h1 className="text-2xl font-bold text-white tracking-wide group-hover:scale-105 transition-transform duration-300">
            Barber<span className="text-pink-500">Q</span>
          </h1>
        </div>

        {/* Role Display */}
        <p className="ml-4 px-3 py-0.5 text-xs rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 font-semibold tracking-wide">
          {aToken ? 'Admin' : 'Barber'}
        </p>
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="bg-pink-500 hover:bg-pink-600 text-white font-semibold text-sm px-5 py-2 rounded-xl shadow-lg hover:shadow-pink-500/20 transition-all duration-300 cursor-pointer"
      >
        Logout
      </button>
    </nav>
  )
}

export default Navbar
