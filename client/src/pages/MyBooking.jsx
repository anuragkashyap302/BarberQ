import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate import kiya
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { barberImages } from "../assets/assets";
import QueueTracker from "../components/QueueTracker"; // QueueTracker component import kiya
import ChatDrawer from "../components/ChatDrawer"; // ChatDrawer component import kiya

const MyBooking = () => {
  const { backendURL , token, getBarbersData, userData } = useContext(AppContext);
  const [bookings, setBookings] = useState([])
  const navigate = useNavigate();

  // Chat drawer visibility aur configuration state parameters
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatBookingId, setChatBookingId] = useState("");
  const [chatBarberId, setChatBarberId] = useState("");
  const [chatBarberName, setChatBarberName] = useState("");
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
            className="flex flex-col bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden hover:border-pink-500/30 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-pink-500/5 relative p-6 space-y-4"
          >
            {/* Header: Circle Avatar & Barber Name / Details */}
            <div className="flex items-center gap-4 border-b border-white/5 pb-4">
              {/* Circle Avatar with Shadow Glow */}
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-pink-500/25 blur-lg rounded-full scale-90"></div>
                <img
                  src={barberImages[item.barberData.image] || item.barberData.image}
                  alt={item.barberData.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-pink-500/20 shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:scale-105 transition-transform duration-300 relative z-10"
                />
              </div>

              {/* Barber Name and Rating */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white tracking-wide truncate">
                    {item.barberData.name}
                  </h3>
                  {/* Status Badge */}
                  <div>
                    {item.cancelled && (
                      <span className="inline-flex items-center gap-1 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] px-2.5 py-0.5 rounded-full font-semibold">
                        Cancelled
                      </span>
                    )}
                    {item.isCompleted && (
                      <span className="inline-flex items-center gap-1 bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] px-2.5 py-0.5 rounded-full font-semibold">
                        Completed
                      </span>
                    )}
                    {!item.cancelled && !item.isCompleted && item.payment && (
                      <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] px-2.5 py-0.5 rounded-full font-semibold">
                        Paid
                      </span>
                    )}
                    {!item.cancelled && !item.isCompleted && !item.payment && (
                      <span className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] px-2.5 py-0.5 rounded-full font-semibold">
                        {item.paymentMethod === 'Cash' ? "Pay at Salon" : "Unpaid"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-amber-400 mt-1">
                  <span>★</span>
                  <span className="text-gray-300 font-bold">{item.barberData.rating || "4.5"}</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-400 font-light">{item.barberData.experience} Exp</span>
                </div>
              </div>
            </div>

            {/* Middle Section: Clean 2x2 Grid of Appointment Details */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 py-1">
              {/* Service */}
              <div className="flex items-center gap-2 text-xs">
                <svg className="w-4 h-4 text-pink-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7a3 3 0 11-6 0 3 3 0 016 0zm-3 12a3 3 0 100-6 3 3 0 000 6z"></path>
                </svg>
                <span className="text-gray-300 truncate">
                  <span className="text-gray-500 font-medium mr-1">Service:</span>
                  {item.serviceName || "Styling"}
                </span>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2 text-xs">
                <svg className="w-4 h-4 text-pink-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span className="text-gray-300 truncate">
                  <span className="text-gray-500 font-medium mr-1">Date:</span>
                  {item.slotDate}
                </span>
              </div>

              {/* Time */}
              <div className="flex items-center gap-2 text-xs">
                <svg className="w-4 h-4 text-pink-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="text-gray-300 truncate">
                  <span className="text-gray-500 font-medium mr-1">Time:</span>
                  {item.slotTime}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2 text-xs">
                <svg className="w-4 h-4 text-pink-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="text-gray-300 truncate">
                  <span className="text-gray-500 font-medium mr-1">Price:</span>
                  <span className="text-pink-400 font-extrabold">₹{item.amount}</span>
                </span>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-2 text-xs text-gray-400 bg-white/5 border border-white/5 p-3 rounded-2xl">
              <svg className="w-4 h-4 text-pink-400/70 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span className="leading-relaxed font-light">
                {item.barberData.address.line1}, {item.barberData.address.line2}
              </span>
            </div>

            {/* Real-time queue tracker display (Renders internally only when waiting/active) */}
            <QueueTracker bookingId={item._id} barberId={item.barberId} />

            {/* Lower Section: Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
              {/* Pay Online */}
              {!item.cancelled && !item.payment && !item.isCompleted && item.paymentMethod === 'Stripe' && (
                <button
                  onClick={() => bookingStripe(item._id)}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] text-white font-bold rounded-xl text-xs transition-all duration-300 cursor-pointer"
                >
                  Pay Online
                </button>
              )}

              {/* Chat Button */}
              {!item.cancelled && !item.isCompleted && (
                <button
                  onClick={() => {
                    setChatBookingId(item._id);
                    setChatBarberId(item.barberId);
                    setChatBarberName(item.barberData.name);
                    setIsChatOpen(true);
                  }}
                  className="px-4 py-2 bg-pink-500 hover:bg-pink-600 hover:shadow-[0_0_15px_rgba(236,72,153,0.3)] text-white font-bold rounded-xl text-xs transition-all duration-300 cursor-pointer"
                >
                  Chat
                </button>
              )}

              {/* Cancel Button */}
              {!item.cancelled && !item.isCompleted && (
                <button
                  onClick={() => cancelBooking(item._id)}
                  className="px-4 py-2 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-gray-300 hover:text-red-400 font-bold rounded-xl text-xs transition-all duration-300 cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Dynamic real-time in-app messages drawer display */}
      {userData && (
        <ChatDrawer
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          bookingId={chatBookingId}
          barberId={chatBarberId}
          barberName={chatBarberName}
          senderId={userData._id}
        />
      )}
    </div>
  );
};

export default MyBooking;
