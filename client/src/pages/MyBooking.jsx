import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { barberImages } from "../assets/assets";
const MyBooking = () => {
  const { backendURL , token,getBarbersData } = useContext(AppContext);
  const [bookings, setBookings] = useState([])
  const navigate = useNavigate();
  const getUserBookings = async()=>{
    try {
       const {data} = await axios.get(backendURL + '/api/user/bookings' , {headers:{token}})
        if(data.success){
          setBookings(data.bookings)
          console.log(data);
          
        }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      
    }
  }
  const cancelBooking = async(bookingId)=>{
    try {
      const {data} = await axios.post(backendURL + '/api/user/cancel-booking' , {bookingId} , {headers:{token}})
      if(data.success){
        toast.success(data.message)
        getUserBookings()
        getBarbersData()
      }else{
        toast.error(data.message)
      }
      
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      
    }
    
  }
  //  Stripe checkout trigger karne ka function unpaid bookings ke liye
  const bookingStripe = async (bookingId) => {
    try {
      const { data } = await axios.post(
        backendURL + "/api/user/payment-stripe",
        { bookingId },
        { headers: { token } }
      );
      if (data.success && data.session_url) {
        // Stripe checkout payment page par redirect kiya
        window.location.href = data.session_url;
      } else {
        toast.error(data.message || "Failed to create payment session");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  //  Stripe payment verification handle karne ka function
  const verifyStripePayment = async (bookingId, sessionId) => {
    try {
      const { data } = await axios.post(
        backendURL + "/api/user/verify-stripe",
        { bookingId, session_id: sessionId },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message || "Payment Successful & Slot Confirmed!");
        getUserBookings();
        getBarbersData();
      } else {
        toast.error(data.message || "Payment verification failed");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      // URL clean up parameter reset kiya
      navigate("/my-bookings", { replace: true });
    }
  };

  useEffect(() => {
    if (token) {
      // URL params me check kar rahe hai Stripe redirected response
      const query = new URLSearchParams(window.location.search);
      const success = query.get("success");
      const cancel = query.get("cancel");
      const bookingId = query.get("bookingId");
      const sessionId = query.get("session_id");

      if (success === "true" && bookingId && sessionId) {
        verifyStripePayment(bookingId, sessionId);
      } else if (cancel === "true") {
        toast.warning("Payment cancelled by user.");
        navigate("/my-bookings", { replace: true });
        getUserBookings();
      } else {
        getUserBookings();
      }
    }
  }, [token]);

  return (
    <div className="py-10 px-4 max-w-6xl mx-auto mt-16">
      {/* Page Title */}
      <h2 className="text-3xl font-extrabold text-pink-400 mb-10 text-center tracking-tight drop-shadow-md">
        My Bookings
      </h2>

      {/* Booking Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {bookings.map((item, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-pink-500/30 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-pink-500/5"
          >
            {/* Left: Image Container */}
            <div className="relative w-full sm:w-44 h-48 sm:h-auto flex-shrink-0 overflow-hidden bg-white/5">
              <img
                src={barberImages[item.barberData.image] || item.barberData.image}
                alt={item.barberData.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Right: Info Container */}
            <div className="flex flex-col justify-between flex-grow p-5 space-y-4">
              {/* Upper Section */}
              <div className="space-y-2.5">
                {/* Header: Name and Status */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-wide">
                      {item.barberData.name}
                    </h3>
                    {/* Rating & Exp */}
                    <div className="flex items-center gap-1 text-xs text-amber-400 mt-0.5">
                      <span>★</span>
                      <span className="text-gray-300">{item.barberData.rating || "4.5"}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-400 font-light">{item.barberData.experience} Exp</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {item.cancelled && (
                      <span className="inline-flex items-center gap-1 bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-2.5 py-1 rounded-full font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        Cancelled
                      </span>
                    )}
                    {item.isCompleted && (
                      <span className="inline-flex items-center gap-1 bg-green-500/10 border border-green-500/20 text-green-400 text-xs px-2.5 py-1 rounded-full font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        Completed
                      </span>
                    )}
                    {!item.cancelled && !item.isCompleted && item.payment && (
                      <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1 rounded-full font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Paid
                      </span>
                    )}
                    {!item.cancelled && !item.isCompleted && !item.payment && (
                      <span className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs px-2.5 py-1 rounded-full font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        {item.paymentMethod === 'Cash' ? "Pay at Salon" : "Unpaid"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Service */}
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-pink-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7a3 3 0 11-6 0 3 3 0 016 0zm-3 12a3 3 0 100-6 3 3 0 000 6z"></path>
                  </svg>
                  <span className="text-gray-300">
                    <span className="text-pink-400 font-medium">Service:</span>{" "}
                    {item.serviceName || (Array.isArray(item.barberData.services) ? item.barberData.services.map(s => s.name).join(", ") : item.barberData.services)}
                  </span>
                </div>

                {/* Slot Date & Time */}
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-pink-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span className="text-gray-300">
                    <span className="text-pink-300 font-medium">Date & Time:</span> {item.slotDate} | {item.slotTime}
                  </span>
                </div>

                {/* Address */}
                <div className="flex items-start gap-2 text-sm text-gray-400">
                  <svg className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span className="leading-tight font-light">
                    {item.barberData.address.line1}, {item.barberData.address.line2}
                  </span>
                </div>
              </div>

              {/* Lower Section: Price & Actions */}
              <div className="flex items-center justify-between gap-4 pt-3.5 border-t border-white/5">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Total Price</p>
                  <p className="text-xl font-extrabold text-pink-400">₹{item.amount || item.barberData.fees}</p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Pay Online */}
                  {!item.cancelled && !item.payment && !item.isCompleted && item.paymentMethod === 'Stripe' && (
                    <button
                      onClick={() => bookingStripe(item._id)}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl text-sm shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                    >
                      Pay Online
                    </button>
                  )}

                  {/* Cancel Booking */}
                  {!item.cancelled && !item.isCompleted && (
                    <button
                      onClick={() => cancelBooking(item._id)}
                      className="px-3.5 py-2 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-gray-300 hover:text-red-400 font-semibold rounded-xl text-sm transition-all duration-300 cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBooking;
