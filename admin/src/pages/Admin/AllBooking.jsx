import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

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
      <h2 className="text-2xl font-bold mb-6 text-center">All Bookings</h2>

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
  <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500 text-white font-bold text-xs shadow-md">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
    Cancelled
  </span>
) : booking.isCompleted ? <p className='text-green-500 text-xs font-medium'>Completed</p>: (
  <button onClick={() => cancelBooking(booking._id)}
    className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-700 text-white font-medium text-sm hover:from-red-600 hover:to-red-800 transition cursor-pointer"
  >
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
