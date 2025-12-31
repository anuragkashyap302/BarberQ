import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { BarberContext } from '../context/BarberContext'

const Login = () => {
  const [state, setState] = useState('Admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {setAToken , backendURL} = useContext(AdminContext)
  const {setBToken} = useContext(BarberContext)
  // dhayn rahe jo naming context me kiya hai wahi use karna hai yaha pe

const onSubmitHandler = async(e) =>{
  e.preventDefault();
  try {
     if(state === 'Admin'){
        const {data} = await axios.post(backendURL + '/api/admin/login', {email, password})
        if(data.success){
           localStorage.setItem('aToken', data.token);
           setAToken(data.token);
            
        } else{
            toast.error(data.message);
        }
      } else{
          const {data} = await axios.post(backendURL + '/api/barber/login', {email, password})
          if(data.success){
           localStorage.setItem('bToken', data.token);
           setBToken(data.token);
           console.log(data.token);
           
            
        } else{
            toast.error(data.message);
        }
      }
  } catch (error) {
    
  }
}

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#2c1b1b] px-4">
      <form onSubmit={onSubmitHandler} className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
        {/* Title */}
        <p className="text-2xl font-bold text-center text-white mb-6">
          <span className="text-pink-500">{state}</span> Login
        </p>

        {/* Email */}
        <div className="mb-4">
          <p className="text-sm text-gray-300 mb-1">Email</p>
          <input onChange={(e)=>setEmail(e.target.value)} value={email}
            type="email"
            required
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none border border-transparent focus:border-pink-500 transition"
            placeholder="Enter your email"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <p className="text-sm text-gray-300 mb-1">Password</p>
          <input onChange={(e)=>setPassword(e.target.value)} value={password}
            type="password"
            required
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none border border-transparent focus:border-pink-500 transition"
            placeholder="Enter your password"
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-pink-600 hover:bg-pink-700 transition-colors py-2 rounded-lg font-semibold shadow-lg cursor-pointer"
        >
          Login
        </button>

        {/* Toggle Login Type */}
        <div className="mt-6 text-center text-sm text-gray-300">
          {state === 'Admin' ? (
            <p>
              Login as Barber?{" "}
              <span
                onClick={() => setState('Barber')}
                className="text-pink-400 cursor-pointer hover:underline"
              >
                Click here
              </span>
            </p>
          ) : (
            <p>
              Login as Admin?{" "}
              <span
                onClick={() => setState('Admin')}
                className="text-pink-400 cursor-pointer hover:underline"
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

export default Login
