import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {

  const {backendURL , token , setToken} = useContext(AppContext)
  const navigate = useNavigate()
  const [state, setState] = useState("Sign Up"); // "Sign Up" | "Login" | "Forgot Password"
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
        } else if(state === 'Login'){
           const {data} = await axios.post(backendURL + '/api/user/login' , {password, email})
          if(data.success){
            localStorage.setItem('token' , data.token)
            setToken(data.token)
          } else{
              toast.error(data.message)
          }
        } else if(state === 'Forgot Password'){
           const {data} = await axios.post(backendURL + '/api/user/forgot-password', { email, newPassword: password });
           if(data.success){
             toast.success(data.message);
             setState('Login');
             setPassword('');
           } else {
             toast.error(data.message);
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
      className="min-h-[85vh] flex items-center justify-center px-4 pt-28 pb-16"
    >
      <div className="bg-slate-900/70 backdrop-blur-xl w-full max-w-md p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/10 text-white">
        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-2">
          {state === "Sign Up"
            ? "Create Account"
            : state === "Login"
            ? "Welcome Back"
            : "Reset Password"}
        </h2>
        <p className="text-gray-400 text-center mb-6 text-sm">
          {state === "Sign Up"
            ? "Please sign up to book an appointment"
            : state === "Login"
            ? "Please log in to book an appointment"
            : "Enter your registered email and a new password"}
        </p>

        {/* Full Name (Sign Up only) */}
        {state === "Sign Up" && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Anurag Kumar"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-white placeholder-gray-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 focus:outline-none transition"
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
            className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-white placeholder-gray-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 focus:outline-none transition"
            required
          />
        </div>

        {/* Password / New Password */}
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">
            {state === "Forgot Password" ? "New Password" : "Password"}
          </label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-white placeholder-gray-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 focus:outline-none transition"
            required
          />
        </div>

        {/* Forgot Password Link (Login state only) */}
        {state === "Login" && (
          <div className="flex justify-end mb-4">
            <span
              onClick={() => {
                setState("Forgot Password");
                setPassword("");
              }}
              className="text-xs text-pink-400 hover:underline cursor-pointer"
            >
              Forgot password?
            </span>
          </div>
        )}

        {/* Spacing compensation for states without forgot-password link */}
        {state !== "Login" && <div className="mb-4" />}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-pink-500 hover:bg-pink-600 transition-all duration-300 font-semibold text-base shadow-lg hover:shadow-pink-500/30 cursor-pointer"
        >
          {state === "Sign Up"
            ? "Create Account"
            : state === "Login"
            ? "Login"
            : "Update Password"}
        </button>

        {/* Switch links */}
        <div className="text-center text-gray-400 mt-6 space-y-2">
          {state === "Forgot Password" ? (
            <p>
              Remember your password?{" "}
              <span
                onClick={() => {
                  setState("Login");
                  setPassword("");
                }}
                className="text-pink-400 hover:underline cursor-pointer"
              >
                Login
              </span>
            </p>
          ) : (
            <p>
              {state === "Sign Up"
                ? "Already have an account?"
                : "Don’t have an account?"}{" "}
              <span
                onClick={() => {
                  setState(state === "Sign Up" ? "Login" : "Sign Up");
                  setPassword("");
                }}
                className="text-pink-400 hover:underline cursor-pointer"
              >
                {state === "Sign Up" ? "Login" : "Sign Up"}
              </span>
            </p>
          )}
        </div>
      </div>
    </form>
  );
};

export default Login;

