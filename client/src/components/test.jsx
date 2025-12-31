import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { token, setToken, userData } = useContext(AppContext);

  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
  };

  const navLinkStyle = ({ isActive }) =>
    `px-4 py-1 rounded-full transition-all duration-300 
     ${isActive ? "bg-white/20 text-white" : "text-gray-300 hover:text-white"}`;

  return (
    <div className="fixed top-0 w-full z-50 px-6 md:px-20 py-3 flex items-center justify-between bg-black/30 backdrop-blur-md shadow-md">
      {/* Logo */}
      <div
        onClick={() => {
          navigate("/");
          scrollTo(0, 0);
        }}
        className="text-2xl font-bold cursor-pointer flex items-center"
      >
        <span className="text-white">Barber</span>
        <span className="ml-1 bg-gradient-to-r from-pink-500 to-yellow-400 bg-clip-text text-transparent">
          Q
        </span>
      </div>

      {/* Centered Nav Pills (Desktop) */}
      <ul className="hidden md:flex items-center bg-white/10 backdrop-blur-lg rounded-full px-6 py-2 gap-4 text-sm">
        <NavLink to="/" className={navLinkStyle}>
          Home
        </NavLink>
        <NavLink to="/barbers" className={navLinkStyle}>
          All Barbers
        </NavLink>
        <NavLink to="/about" className={navLinkStyle}>
          About
        </NavLink>
        <NavLink to="/contact" className={navLinkStyle}>
          Contact
        </NavLink>
      </ul>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Search Icon */}
        <button className="p-2 rounded-full hover:bg-white/10 transition md:block hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
            />
          </svg>
        </button>

        {/* Profile / Login */}
        {token && userData ? (
          <div className="relative group">
            <img
              className="w-9 h-9 rounded-full cursor-pointer ring-2 ring-pink-500"
              src={userData.image}
              alt=""
            />
            <div className="absolute right-0 mt-3 w-44 bg-black/90 text-white rounded-lg shadow-lg hidden group-hover:block p-3 space-y-2">
              <p
                onClick={() => navigate("/my-profile")}
                className="hover:text-pink-400 cursor-pointer"
              >
                My Profile
              </p>
              <p
                onClick={() => navigate("/my-bookings")}
                className="hover:text-pink-400 cursor-pointer"
              >
                My Bookings
              </p>
              <p
                onClick={logout}
                className="hover:text-pink-400 cursor-pointer"
              >
                Logout
              </p>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-pink-500 to-yellow-400 text-black px-6 py-2 rounded-full font-medium shadow-md hover:scale-105 transition-transform"
          >
            Login
          </button>
        )}

        {/* Mobile Menu Icon */}
        <img
          onClick={() => setShowMenu(true)}
          className="w-7 md:hidden cursor-pointer"
          src={assets.menu_icon}
          alt=""
        />
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-3/4 bg-black/95 backdrop-blur-md flex flex-col items-start justify-start pt-6 px-6 z-50 transform transition-transform duration-300 ease-in-out
        ${showMenu ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <h1
            onClick={() => {
              navigate("/");
              setShowMenu(false);
            }}
            className="text-2xl font-bold tracking-wide flex items-center cursor-pointer text-white"
          >
            Barber
            <span className="ml-1 bg-gradient-to-r from-pink-500 to-yellow-400 bg-clip-text text-transparent">
              Q
            </span>
          </h1>
          <img
            onClick={() => setShowMenu(false)}
            src={assets.cross_icon}
            className="w-7 cursor-pointer"
            alt="close"
          />
        </div>

        {/* Menu Links */}
        <ul className="flex flex-col gap-6 text-lg font-medium mt-12 w-full text-center">
          <NavLink
            to="/"
            onClick={() => setShowMenu(false)}
            className={({ isActive }) =>
              `py-2 rounded-md transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-pink-500 to-yellow-400 text-black"
                  : "text-gray-300 hover:bg-gradient-to-r from-pink-500 to-yellow-400 hover:text-black"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/barbers"
            onClick={() => setShowMenu(false)}
            className={({ isActive }) =>
              `py-2 rounded-md transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-pink-500 to-yellow-400 text-black"
                  : "text-gray-300 hover:bg-gradient-to-r from-pink-500 to-yellow-400 hover:text-black"
              }`
            }
          >
            All Barbers
          </NavLink>
          <NavLink
            to="/about"
            onClick={() => setShowMenu(false)}
            className={({ isActive }) =>
              `py-2 rounded-md transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-pink-500 to-yellow-400 text-black"
                  : "text-gray-300 hover:bg-gradient-to-r from-pink-500 to-yellow-400 hover:text-black"
              }`
            }
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            onClick={() => setShowMenu(false)}
            className={({ isActive }) =>
              `py-2 rounded-md transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-pink-500 to-yellow-400 text-black"
                  : "text-gray-300 hover:bg-gradient-to-r from-pink-500 to-yellow-400 hover:text-black"
              }`
            }
          >
            Contact
          </NavLink>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
