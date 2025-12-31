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
    <nav className="w-full bg-gradient-to-r from-pink-600 to-purple-700 px-6 py-3 flex items-center justify-between shadow-lg">
      {/* Logo + Role */}
      <div className="flex items-center gap-3">
        {/* SVG Icon */}
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-pink-600"
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
        <h1 className="text-2xl font-bold text-white tracking-wide">
          Barber<span className="text-yellow-300">Q</span>
        </h1>

        {/* Role Display */}
        <p className="ml-4 px-3 py-1 text-sm rounded-full bg-white/20 text-white font-medium">
          {aToken ? 'Admin' : 'Barber'}
        </p>
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="bg-white text-pink-600 font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-pink-100 transition"
      >
        Logout
      </button>
    </nav>
  )
}

export default Navbar
