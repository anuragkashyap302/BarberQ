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
        {/* SVG Icon */}
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-pink-500/10 border border-pink-500/20 shadow-md cursor-pointer hover:scale-110 transition-all duration-300" onClick={() => navigate('/')}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-pink-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 11c0 1.105-.895 2-2 2s-2-.895-2-2 .895-2 2-2 2 .895 2 2zm0 0v7m0-7l3.293-3.293a1 1 0 00-1.414-1.414L12 8.172l-1.879-1.879a1 1 0 00-1.414 1.414L12 11z"
            />
          </svg>
        </div>

        {/* Text Logo */}
        <h1 className="text-2xl font-bold text-white tracking-wide cursor-pointer hover:scale-110 transition-all duration-300" onClick={ () => navigate('/')}>
          Barber<span className="text-pink-500">Q</span>
        </h1>

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
