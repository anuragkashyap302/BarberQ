import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { token, setToken, userData } = useContext(AppContext);

  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
  };
 useEffect(() => {
        if(location.pathname !== '/') {
            setIsScrolled(true);
            return;
        }else {
            setIsScrolled(false);
        }

        setIsScrolled(prev => location.pathname !== '/' ? true : prev   );
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [location.pathname]);
  // Reusable link styling
  const navLinkStyle = ({ isActive }) =>
    `relative py-1 transition-all duration-300 
     ${isActive ? "text-pink-400" : "text-gray-300 hover:text-white"}
     after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0
     after:bg-gradient-to-r after:from-pink-500 after:to-yellow-400
     after:transition-all after:duration-300 hover:after:w-full`;

  return (
    <div className={`fixed top-0 left-0  w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${isScrolled ? "bg-black/30 shadow-md text-white backdrop-blur-lg py-3 md:py-4" : "py-4 md:py-6"}`}>
      {/* Logo */}
      <nav
        onClick={() => {
          navigate("/");
          scrollTo(0, 0);
        }}
        className="cursor-pointer"
      >
        <h1 className="text-2xl font-bold tracking-wide flex items-center text-white hover:scale-105 transition-transform duration-300">
          Barber
          <span className="ml-1 bg-gradient-to-r from-pink-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg flex items-center">
            Q
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 ml-1 text-yellow-300 drop-shadow-[0_0_4px_rgba(255,191,73,0.8)]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M9.828 14.828a4 4 0 015.656 0l2.828 2.828a4 4 0 11-5.656 5.656l-2.828-2.828a4 4 0 010-5.656zM4 2a1 1 0 000 2h.586l7.707 7.707a5.978 5.978 0 00-.83 1.457L4 5.414V6a1 1 0 102 0V4a1 1 0 00-1-1H4zm17 0a1 1 0 010 2h-.586l-5.707 5.707a5.978 5.978 0 00-.83-1.457L20 5.414V6a1 1 0 102 0V4a1 1 0 00-1-1h.586z" />
            </svg>
          </span>
        </h1>
      </nav>

      {/* Desktop Links */}
      <ul className="font-bold hidden md:flex items-center bg-white/10 backdrop-blur-lg rounded-full px-6 py-2 gap-12 text-sm">
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

      {/* Profile / Login Button */}
      <div className="flex items-center gap-4">
        {token && userData ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <img
              className="w-9 h-9 rounded-full ring-2 ring-pink-400"
              src={userData.image}
              alt=""
            />
            <img className="w-2.5" src={assets.dropdown_icon} alt="" />
            <div className="absolute top-0 right-0 pt-14 text-base font-medium hidden group-hover:block">
              <div className="min-w-48 bg-stone-800 rounded-lg shadow-lg flex flex-col gap-3 p-4">
                <p
                  onClick={() => {
                    navigate("/my-profile");
                    scrollTo(0, 0);
                  }}
                  className="hover:text-pink-400 cursor-pointer"
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate("/my-bookings")}
                  className="hover:text-pink-400 cursor-pointer"
                >
                  My Booking
                </p>
                <p
                  onClick={logout}
                  className="hover:text-pink-400 cursor-pointer"
                >
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-pink-500 to-yellow-400 text-black px-6 py-2 rounded-full font-medium shadow-md hover:scale-105 transition-transform hidden md:block cursor-pointer"
          >
            Create account
          </button>
        )}

        {/* Mobile Hamburger Icon */}
        <img
          onClick={() => setShowMenu(true)}
          className="w-7 md:hidden cursor-pointer"
          src={assets.menu_icon}
          alt=""
        />
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-3/4 bg-black/95 backdrop-blur-md flex flex-col items-start justify-start pt-6 px-6 z-50 transform transition-transform duration-300 ease-in-out shadow-lg
        ${showMenu ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header with Logo + Close */}
        <div className="flex items-center justify-between w-full">
          <h1
            onClick={() => {
              navigate("/");
              setShowMenu(false);
            }}
            className="text-2xl font-bold tracking-wide flex items-center cursor-pointer text-white"
          >
            Barber
            <span className="ml-1 bg-gradient-to-r from-pink-500 to-yellow-400 bg-clip-text text-transparent flex items-center">
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
          {["/", "/barbers", "/about", "/contact"].map((path, i) => {
            const labels = ["Home", "All Barbers", "About", "Contact"];
            return (
              <NavLink
                key={path}
                to={path}
                onClick={() => setShowMenu(false)}
                className={({ isActive }) =>
                  `py-2 rounded-md transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-pink-500 to-yellow-400 text-black shadow-md"
                      : "text-gray-300 hover:bg-gradient-to-r from-pink-500 to-yellow-400 hover:text-black"
                  }`
                }
              >
                {labels[i]}
              </NavLink>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
