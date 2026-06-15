import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import {LucideSearch} from  "lucide-react"
const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchCity, setSearchCity] = useState("");
  const [searchService, setSearchService] = useState("All");
  const { token, setToken, userData, barbers } = useContext(AppContext);

  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
  };

  // Extract unique cities from barbers
  const cities = [...new Set(barbers.map(b => b.address?.line2).filter(Boolean))].sort();

  // Handle search
  const handleSearch = () => {
    if (!searchCity.trim()) return;
    const params = new URLSearchParams();
    params.append("city", searchCity);
    if (searchService !== "All") params.append("service", searchService);
    navigate(`/barbers?${params.toString()}`);
    setShowSearch(false);
    setSearchCity("");
    setSearchService("All");
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

      {/* Desktop Links + Search */}
      <div className="hidden md:flex items-center gap-6">
        {/* Nav Links */}
        <ul className="font-bold flex items-center bg-white/10 backdrop-blur-lg rounded-full px-6 py-2 gap-12 text-sm">
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

        {/* Desktop Search */}
        <div className="relative group">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="bg-gradient-to-r from-pink-500 to-yellow-400 text-black px-4 py-2 rounded-full font-medium shadow-md hover:scale-105 transition-transform flex items-center gap-2"
          >
            <LucideSearch/> Search
          </button>
          {showSearch && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-gradient-to-b from-gray-900 to-black border-2 border-pink-500 rounded-lg p-4 shadow-2xl z-40">
              <p className="text-sm text-pink-400 mb-3 font-semibold">🔍 Find Barber</p>
              <input
                type="text"
                placeholder="Enter city..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 mb-3 text-sm"
              />
              <select
                value={searchService}
                onChange={(e) => setSearchService(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 mb-3 text-sm"
              >
                <option value="All">All Services</option>
                <option value="Haircut & Styling">Haircut & Styling</option>
                <option value="Beard Grooming">Beard Grooming</option>
                <option value="Facial & Spa">Facial & Spa</option>
              </select>
              <div className="flex gap-2 mb-3">
                <button
                  onClick={handleSearch}
                  className="flex-1 bg-gradient-to-r from-pink-600 to-pink-500 text-white px-3 py-2 rounded-lg hover:from-pink-700 hover:to-pink-600 transition font-medium text-sm"
                >
                  Search
                </button>
                <button
                  onClick={() => {
                    setShowSearch(false);
                    setSearchCity("");
                    setSearchService("All");
                  }}
                  className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition text-sm"
                >
                  Cancel
                </button>
              </div>
              {cities.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 mb-2">Popular cities:</p>
                  <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
                    {cities.slice(0, 6).map((city, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSearchCity(city)}
                        className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded hover:bg-pink-600 hover:text-white transition whitespace-nowrap"
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Profile / Login Button - Desktop Only */}
      <div className="hidden md:flex items-center gap-4">
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
            className="bg-gradient-to-r from-pink-500 to-yellow-400 text-black px-6 py-2 rounded-full font-medium shadow-md hover:scale-105 transition-transform cursor-pointer"
          >
            Create account
          </button>
        )}
      </div>

      {/* Mobile Hamburger Icon + Search */}
      <div className="md:hidden flex items-center gap-3">
        {/* Mobile Search Icon */}
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="text-white text-2xl hover:text-pink-400 transition"
        >
          <LucideSearch/>
        </button>
        <img
          onClick={() => setShowMenu(true)}
          className="w-7 cursor-pointer"
          src={assets.menu_icon}
          alt=""
        />
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-screen w-3/4 bg-gradient-to-b from-gray-900 via-black to-gray-900 border-l border-pink-500/30 flex flex-col z-50 transform transition-transform duration-300 ease-in-out shadow-2xl
        ${showMenu ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header with Logo + Close - Fixed */}
        <div className="flex items-center justify-between w-full px-6 py-4 border-b border-gray-700 bg-black/50 sticky top-0 z-40">
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
            className="w-7 cursor-pointer hover:scale-110 transition"
            alt="close"
          />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Mobile Search in Menu */}
          <div className="w-full mb-6 pb-4 border-b border-gray-700">
            <p className="text-sm text-pink-400 mb-3 font-semibold">🔍 Search Barber</p>
            <input
              type="text"
              placeholder="Enter city..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 mb-2 text-sm"
            />
            <select
              value={searchService}
              onChange={(e) => setSearchService(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 mb-2 text-sm"
            >
              <option value="All">All Services</option>
              <option value="Haircut & Styling">Haircut & Styling</option>
              <option value="Beard Grooming">Beard Grooming</option>
              <option value="Facial & Spa">Facial & Spa</option>
            </select>
            <button
              onClick={() => {
                handleSearch();
                setShowMenu(false);
              }}
              className="w-full bg-gradient-to-r from-pink-600 to-pink-500 text-white px-3 py-2 rounded-lg hover:from-pink-700 hover:to-pink-600 transition font-medium text-sm"
            >
              Search
            </button>
          </div>

          {/* Menu Links */}
          <ul className="flex flex-col gap-2 mb-6">
            {["/", "/barbers", "/about", "/contact"].map((path, i) => {
              const labels = ["Home", "All Barbers", "About", "Contact"];
              return (
                <NavLink
                  key={path}
                  to={path}
                  onClick={() => setShowMenu(false)}
                  className={({ isActive }) =>
                    `py-3 px-4 rounded-lg transition-all duration-300 text-sm font-medium ${
                      isActive
                        ? "bg-gradient-to-r from-pink-600 to-pink-500 text-white shadow-lg"
                        : "text-gray-300 bg-gray-800/50 hover:bg-gradient-to-r hover:from-pink-600/20 hover:to-pink-500/20 hover:text-white"
                    }`
                  }
                >
                  {labels[i]}
                </NavLink>
              );
            })}
          </ul>
        </div>

        {/* Mobile Login/Profile Section - Fixed */}
        <div className="w-full border-t border-gray-700 bg-black/50 p-4 sticky bottom-0">
          {token && userData ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 justify-center mb-3 pb-3 border-b border-gray-700">
                <img
                  className="w-8 h-8 rounded-full ring-2 ring-pink-400"
                  src={userData.image}
                  alt=""
                />
                <p className="text-gray-300 text-sm">{userData.name}</p>
              </div>
              <button
                onClick={() => {
                  navigate("/my-profile");
                  setShowMenu(false);
                  scrollTo(0, 0);
                }}
                className="w-full bg-gradient-to-r from-pink-600 to-pink-500 text-white px-3 py-2 rounded-lg font-medium hover:from-pink-700 hover:to-pink-600 transition text-sm"
              >
                My Profile
              </button>
              <button
                onClick={() => {
                  navigate("/my-bookings");
                  setShowMenu(false);
                  scrollTo(0, 0);
                }}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg font-medium hover:bg-gray-600 transition text-sm"
              >
                My Bookings
              </button>
              <button
                onClick={() => {
                  logout();
                  setShowMenu(false);
                }}
                className="w-full bg-red-700 text-white px-3 py-2 rounded-lg font-medium hover:bg-red-800 transition text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                navigate("/login");
                setShowMenu(false);
              }}
              className="w-full bg-gradient-to-r from-pink-600 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:from-pink-700 hover:to-pink-600 transition cursor-pointer text-sm"
            >
              Create Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
