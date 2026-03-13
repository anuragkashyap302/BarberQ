import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const Dashboard = () => {
  const { aToken, dashData, getDashData, cancelBooking } = useContext(AdminContext)
  const { slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getDashData(aToken)
    }
  }, [aToken])

  return (
    dashData ? (
      <div className="p-6 text-white space-y-8">
        {/* Top Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          {/* Barbers */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:bg-white/20 transition">
            <img src={assets.barber_icon} alt="barbers" className="w-12 h-12" />
            <div>
              <p className="text-2xl font-bold">{dashData.barbers}</p>
              <p className="text-sm text-gray-300">Barbers</p>
            </div>
          </div>

          {/* Bookings */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:bg-white/20 transition">
            <img src={assets.booking_icon} alt="bookings" className="w-12 h-12" />
            <div>
              <p className="text-2xl font-bold">{dashData.bookings}</p>
              <p className="text-sm text-gray-300">Bookings</p>
            </div>
          </div>
          

          {/* Customers */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:bg-white/20 transition">
            <img src={assets.customer_icon} alt="customers" className="w-12 h-12" />
            <div>
              <p className="text-2xl font-bold">{dashData.customer}</p>
              <p className="text-sm text-gray-300">Customers</p>
            </div>
          </div>
          {/* total earning */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:bg-white/20 transition">
            <img src={assets.investment_icon} alt="customers" className="w-12 h-12" />
            <div>
              <p className="text-2xl font-bold">₹{dashData.earning}</p>
              <p className="text-sm text-gray-300">TotalRevenue</p>
            </div>
          </div>
        </div>  
        {/* Latest Bookings */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-3">
            <img src={assets.list_icon} alt="latest" className="w-6 h-6" />
            <p className="text-lg font-semibold">Latest Bookings</p>
          </div>

          <div className="space-y-4">
            {dashData.lastbookings.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white/5 hover:bg-white/10 transition rounded-xl p-4"
              >
                {/* Barber Info */}
                <div className="flex items-center gap-3">
                  <img
                    src={item.barberData.image}
                    alt="barber"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{item.barberData.name}</p>
                    <p className="text-xs text-gray-300">{slotDateFormat(item.slotDate)}</p>
                  </div>
                </div>

                {/* Action */}
                {item.cancelled ? (
                  <span className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-red-600 to-red-800 text-white font-medium text-xs shadow-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancelled
                  </span>
                ) : item.isCompleted ? <p className='text-green-500 text-xs font-medium'>Completed</p>: (
                  <button
                    onClick={() => cancelBooking(item._id, aToken)}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-700 text-white font-medium text-sm hover:from-red-600 hover:to-red-800 transition cursor-pointer shadow-md"
                  >
                    Cancel
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    ) : (
      <div className="p-6 text-white min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading dashboard...</p>
      </div>
    )
  )
}

export default Dashboard
