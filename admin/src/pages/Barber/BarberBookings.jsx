import React, { useContext, useEffect, useState } from 'react'
import { BarberContext } from '../../context/BarberContext'
import { AppContext } from '../../context/AppContext'
import { SocketContext } from '../../context/SocketContext' // Socket Context import kiya
import ChatDrawer from '../../components/ChatDrawer' // ChatDrawer component import kiya
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify' // toast notifications trigger karne ke liye

const BarberBookings = () => {
  const { bToken, bookings, getBookings, completeBooking, cancelBooking, profileData, getProfileData } = useContext(BarberContext)
  const { calcuateAge, slotDateFormat } = useContext(AppContext)
  const socket = useContext(SocketContext) // Socket retrieve kiya

  // Chat drawer parameters state hooks
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatBookingId, setChatBookingId] = useState("")
  const [chatCustomerId, setChatCustomerId] = useState("")
  const [chatCustomerName, setChatCustomerName] = useState("")

  // Web audio based sound generator notification play logic ye jadya ho gya but ok
  // mail bhi kar hi rahe hai
  const playSoundAlert = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // Pitch (A5 note)
      gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.3); // Play for 300ms
    } catch (e) {
      console.log("Audio play blocked by browser permissions:", e.message);
    }
  };

  useEffect(() => {
    if (bToken) {
      getBookings(bToken)
      getProfileData(bToken)
    }
  }, [bToken])

  // Realtime Socket room subscription aur events listener hook yaha thora
  // problme hai ki barber and user baat kaise karnge like barber ko har
  // booked user ka presonal chat drawwer hona chiye 
  useEffect(() => {
    if (socket && profileData?._id) {
      // Barber dynamically joins their own room (barber_id)
      socket.emit("join_barber_room", profileData._id);

      // Listening for new customer bookings
      socket.on("new_booking_alert", (data) => {
        // play alert sound
        playSoundAlert();
        toast.info(`New Appointment Booked by ${data.userName} at ${data.slotTime}!`);
        getBookings(bToken); // dynamic list refresh
      });

      // Listening for other queue modifications yahi to most impt hia
      // live queue batana hai taki smay barbed na ho
      socket.on("queue_update", () => {
        getBookings(bToken); // refresh queue status values
      });

      return () => {
        socket.off("new_booking_alert");
        socket.off("queue_update");
      };
    }
  }, [socket, profileData?._id]);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#2c1b1b] text-white">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-white">All <span className="text-pink-500">Bookings</span></h2>

      {/* Desktop Table Header */}
      <div className="hidden md:grid grid-cols-7 gap-4 py-3 px-4 rounded-lg bg-white/10 backdrop-blur-md text-sm font-semibold uppercase tracking-wide">
        <p>#</p>
        <p>Customer</p>
        <p>Payment</p>
        <p>Age</p>
        <p>Date & Time</p>
        <p>Fees</p>
        <p>Action</p>
      </div>

      {/* Bookings List */}
      <div className="space-y-4 mt-4">
        {bookings.map((item, index) => (
          <div
            key={index}
            className="bg-white/5 backdrop-blur-md rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
          >
            {/* Desktop Grid */}
            <div className="hidden md:grid grid-cols-7 gap-4 items-center">
              <p>{index + 1}</p>
              <div className="flex items-center gap-2">
                <img
                  src={item.userData.image}
                  alt={item.userData.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <p className="font-medium mr-3">{item.userData.name}</p>
              </div>
              <p className="text-sm ml-4">{item.payment ? 'Online' : 'Cash'}</p>
              <p>{calcuateAge(item.userData.dob)}</p>
              <p>
                {slotDateFormat(item.slotDate)}, {item.slotTime}
              </p>
              <p className="font-semibold text-green-400">₹{item.amount}</p>              {item.cancelled ? <p className='text-red-500'>Cancelled</p> : item.isCompleted
                ? <p className='text-green-500'>Completed</p> : <div className="flex gap-3">

                  {/* Real-time customer chat button trigger */}
                  <button 
                    onClick={() => {
                      setChatBookingId(item._id);
                      setChatCustomerId(item.userId);
                      setChatCustomerName(item.userData.name);
                      setIsChatOpen(true);
                    }} 
                    className="p-2 rounded-full bg-pink-500/20 hover:bg-pink-500/40 text-pink-400 hover:text-white transition cursor-pointer flex items-center justify-center"
                    title="Chat with Customer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                  </button>

                  <button onClick={() => cancelBooking(item._id, bToken)} className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/40 transition cursor-pointer">
                    <img src={assets.cancel_icon} alt="cancel" className="w-5" />
                  </button>
                  <button onClick={() => completeBooking(item._id, bToken)} className="p-2 rounded-full bg-green-500/20 hover:bg-green-500/40 transition cursor-pointer">
                    <img src={assets.tick_icon} alt="confirm" className="w-5" />
                  </button>
                </div>}

            </div>

            {/* Mobile Card */}
            <div className="flex flex-col gap-3 md:hidden">
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-70">Booking #{index + 1}</span>
                <span className="font-semibold text-green-400">₹{item.amount}</span>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src={item.userData.image}
                  alt={item.userData.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{item.userData.name}</p>
                  <p className="text-xs opacity-70">{calcuateAge(item.userData.dob)} yrs</p>
                </div>
              </div>
              <div className="text-sm">
                <p>
                  <span className="font-semibold">Payment:</span>{' '}
                  {item.payment ? 'Online' : 'Cash'}
                </p>
                <p>
                  <span className="font-semibold">Date:</span>{' '}
                  {slotDateFormat(item.slotDate)}, {item.slotTime}
                </p>
              </div>
              {item.cancelled ? <p>Cancelled</p> : item.isCompleted
                ? <p>Completed</p> : <div className="flex gap-3">

                  {/* Real-time customer chat button trigger (Mobile) */}
                  <button 
                    onClick={() => {
                      setChatBookingId(item._id);
                      setChatCustomerId(item.userId);
                      setChatCustomerName(item.userData.name);
                      setIsChatOpen(true);
                    }} 
                    className="p-2 rounded-full bg-pink-500/20 hover:bg-pink-500/40 text-pink-400 hover:text-white transition cursor-pointer flex items-center justify-center"
                    title="Chat with Customer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                  </button>

                  <button onClick={() => cancelBooking(item._id, bToken)} className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/40 transition cursor-pointer">
                    <img src={assets.cancel_icon} alt="cancel" className="w-5" />
                  </button>
                  <button onClick={() => completeBooking(item._id, bToken)} className="p-2 rounded-full bg-green-500/20 hover:bg-green-500/40 transition cursor-pointer">
                    <img src={assets.tick_icon} alt="confirm" className="w-5" />
                  </button>
                </div>}
            </div>
          </div>
        ))}
      </div>

      {/* Dynamic real-time customer messages chat drawer component */}
      {profileData && (
        <ChatDrawer
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          bookingId={chatBookingId}
          customerId={chatCustomerId}
          customerName={chatCustomerName}
          senderId={profileData._id}
          token={bToken}
        />
      )}
    </div>
  )
}

export default BarberBookings
