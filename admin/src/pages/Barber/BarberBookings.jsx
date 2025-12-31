import React, { useContext, useEffect } from 'react'
import { BarberContext } from '../../context/BarberContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const BarberBookings = () => {
  const { bToken, bookings, getBookings, completeBooking , cancelBooking } = useContext(BarberContext)
  const { calcuateAge, slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (bToken) {
      getBookings()
    }
  }, [bToken])

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#2c1b1b] text-white">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">📅 All Bookings</h2>

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
              <p className="font-semibold text-green-400">₹{item.amount}</p>
               {item.cancelled ? <p className='text-red-500'>Cancelled</p> : item.isCompleted
 ? <p className='text-green-500'>Completed</p>: <div className="flex gap-3">
               
                <button onClick={()=> cancelBooking(item._id)} className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/40 transition cursor-pointer">
                  <img src={assets.cancel_icon} alt="cancel" className="w-5" />
                </button>
                <button onClick={()=> completeBooking(item._id)} className="p-2 rounded-full bg-green-500/20 hover:bg-green-500/40 transition cursor-pointer">
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
 ? <p>Completed</p>: <div className="flex gap-3">
               
                <button onClick={()=> cancelBooking(item._id)} className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/40 transition cursor-pointer">
                  <img src={assets.cancel_icon} alt="cancel" className="w-5" />
                </button>
                <button onClick={()=> completeBooking(item._id)} className="p-2 rounded-full bg-green-500/20 hover:bg-green-500/40 transition cursor-pointer">
                  <img src={assets.tick_icon} alt="confirm" className="w-5" />
                </button>
              </div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BarberBookings
