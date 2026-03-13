import React, { useContext, useEffect } from 'react'
import { BarberContext } from '../../context/BarberContext'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'

const BarberDashboard = () => {
  const { slotDateFormat } = useContext(AppContext)
  const { bToken, dashData, getDashData, completeBooking, cancelBooking } =
    useContext(BarberContext)

  useEffect(() => {
    if (bToken) {
      getDashData(bToken)
    }
  }, [bToken])

  return (
    dashData ? (
      <div className="p-6 min-h-screen bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#2c1b1b] text-white">
        {/* Top Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {/* Earnings */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:scale-[1.02] transition-transform">
            <img src={assets.earning_icon} alt="earnings" className="w-12 h-12" />
            <div>
              <p className="text-3xl font-extrabold">₹{dashData.earnings}</p>
              <p className="text-sm text-gray-300">Earnings</p>
            </div>
          </div>

          {/* Bookings */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:scale-[1.02] transition-transform">
            <img src={assets.appointments_icon} alt="bookings" className="w-12 h-12" />
            <div>
              <p className="text-3xl font-extrabold">{dashData.totalBookings}</p>
              <p className="text-sm text-gray-300">Bookings</p>
            </div>
          </div>

          {/* Customers */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:scale-[1.02] transition-transform">
            <img src={assets.patients_icon} alt="customers" className="w-12 h-12" />
            <div>
              <p className="text-3xl font-extrabold">{dashData.customers}</p>
              <p className="text-sm text-gray-300">Customers</p>
            </div>
          </div>
        </div>

        {/* Latest Bookings Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-3">
            <img src={assets.list_icon} alt="latest" className="w-6 h-6" />
            <p className="text-lg font-semibold">Latest Bookings</p>
          </div>

          <div className="space-y-4">
            {dashData.latestBooking.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/5 hover:bg-white/10 transition rounded-xl p-4"
              >
                {/* User Info */}
                <div className="flex items-center gap-3">
                  <img
                    src={item.userData.image}
                    alt={item.userData.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{item.userData.name}</p>
                    <p className="text-xs text-gray-300">
                      {slotDateFormat(item.slotDate)}
                    </p>
                  </div>
                </div>

                {/* Status / Action */}
                {item.cancelled ? (
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                    Cancelled
                  </span>
                ) : item.isCompleted ? (
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                    Completed
                  </span>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={() => cancelBooking(item._id, bToken)}
                      className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/40 transition"
                    >
                      <img src={assets.cancel_icon} alt="cancel" className="w-5" />
                    </button>
                    <button
                      onClick={() => completeBooking(item._id, bToken)}
                      className="p-2 rounded-full bg-green-500/20 hover:bg-green-500/40 transition"
                    >
                      <img src={assets.tick_icon} alt="confirm" className="w-5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    ) : (
      <div className="p-6 min-h-screen bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#2c1b1b] text-white flex items-center justify-center">
        <p className="text-xl">Loading dashboard...</p>
      </div>
    )
  )
}

export default BarberDashboard
