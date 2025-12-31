import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {

  const {backendURL , token , setToken} = useContext(AppContext)
  const navigate = useNavigate()
  const [state, setState] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();
     try {
        if(state === 'Sign Up'){
          const {data} = await axios.post(backendURL + '/api/user/register' , {name , password, email})
          if(data.success){
            localStorage.setItem('token' , data.token)
            setToken(data.token)
          } else{
              toast.error(data.message)
          }
        }else{
           const {data} = await axios.post(backendURL + '/api/user/login' , {password, email})
          if(data.success){
            localStorage.setItem('token' , data.token)
            setToken(data.token)
          } else{
              toast.error(data.message)
          }
            
        }
          
     } catch (error) {
         toast.error(error.message)
     }
  };

  useEffect(()=>{
    if(token){
     navigate('/')
    }
  },[token])

  return (
    <form
      onSubmit={onSubmitHandler}
      className="min-h-[80vh] flex items-center justify-center bg-gray-900 px-4 mt-20"
    >
      <div className="bg-gray-800 w-full max-w-md p-8 rounded-2xl shadow-xl text-white">
        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-2">
          {state === "Sign Up" ? "Create Account" : "Welcome Back"}
        </h2>
        <p className="text-gray-400 text-center mb-6">
          Please {state === "Sign Up" ? "sign up" : "log in"} to book an appointment
        </p>

        {/* Full Name */}
        {state === "Sign Up" && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Anurag Kumar"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-pink-500 focus:outline-none"
              required
            />
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="you@example.com"
            className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-pink-500 focus:outline-none"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="••••••••"
            className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-pink-500 focus:outline-none"
            required
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition font-semibold text-lg shadow-lg cursor-pointer"
        >
          {state === "Sign Up" ? "Create Account" : "Login"}
        </button>

        {/* Switch between Login & SignUp */}
        <p className="text-center text-gray-400 mt-6">
          {state === "Sign Up"
            ? "Already have an account?"
            : "Don’t have an account?"}{" "}
          <span
            onClick={() =>
              setState(state === "Sign Up" ? "Login" : "Sign Up")
            }
            className="text-pink-400 hover:underline cursor-pointer"
          >
            {state === "Sign Up" ? "Login" : "Sign Up"}
          </span>
        </p>
      </div>
    </form>
  );
};

export default Login;
