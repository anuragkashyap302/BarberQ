import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { XCircle } from 'lucide-react'

const AllBooking = () => {
  const { aToken, bookings, getAllBookings,cancelBooking } = useContext(AdminContext)
  const { calcuateAge, slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getAllBookings(aToken)
    }
  }, [aToken])

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">All <span className="text-pink-500">Bookings</span></h2>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header */}
          <div className="grid grid-cols-7 gap-4 bg-white/10 backdrop-blur-md rounded-lg px-4 py-3 text-sm font-semibold uppercase tracking-wide">
            <p>#</p>
            <p>Customer</p>
            <p>Age</p>
            <p>Date & Time</p>
            <p>Barber</p>
            <p>Fees</p>
            <p>Actions</p>
          </div>

          {/* Bookings */}
          <div className="mt-3 space-y-3">
            {bookings.map((booking, index) => (
              <div
                key={index}
                className="grid grid-cols-7 gap-4 items-center bg-white/5 hover:bg-white/10 transition-all rounded-lg px-4 py-3 text-sm"
              >
                <p>{index + 1}</p>

                {/* Customer */}
                <div className="flex items-center gap-3">
                  <img
                    src={booking.userData.image}
                    alt="userData"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <p>{booking.userData.name}</p>
                </div>

                {/* Age */}
                <p className="max-sm:hidden">
                  {calcuateAge(booking.userData.dob)}
                </p>

                {/* Date & Time */}
                <p>
                  {slotDateFormat(booking.slotDate)}, {booking.slotTime}
                </p>

                {/* Barber */}
                <div className="flex items-center gap-3">
                  <img
                    src={booking.barberData.image}
                    alt="barberData"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <p>{booking.barberData.name}</p>
                </div>

                {/* Fees */}
                <p className="font-semibold text-green-400">
                  ₹{booking.amount}
                </p>

                {/* Actions */}
               {booking.cancelled ? (
  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-semibold">
    <XCircle size={14} />
    Cancelled
  </span>
) : booking.isCompleted ? <p className='text-green-500 text-xs font-medium'>Completed</p>: (
  <button onClick={() => cancelBooking(booking._id, aToken)}
    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-500/10 hover:bg-pink-600 text-pink-400 hover:text-white border border-pink-500/20 hover:border-transparent transition-all duration-300 text-xs font-semibold shadow-sm cursor-pointer"
  >
    <XCircle size={14} />
    Cancel
  </button>
)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllBooking
