import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { Scissors, Calendar, Users, IndianRupee, ClipboardList, XCircle } from 'lucide-react'
import { barberImages } from '../../assets/assets'

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
            <div className="p-3.5 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/10">
              <Scissors size={28} />
            </div>
            <div>
              <p className="text-2xl font-bold">{dashData.barbers}</p>
              <p className="text-sm text-gray-300">Barbers</p>
            </div>
          </div>

          {/* Bookings */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:bg-white/20 transition">
            <div className="p-3.5 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/10">
              <Calendar size={28} />
            </div>
            <div>
              <p className="text-2xl font-bold">{dashData.bookings}</p>
              <p className="text-sm text-gray-300">Bookings</p>
            </div>
          </div>

          {/* Customers */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:bg-white/20 transition">
            <div className="p-3.5 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/10">
              <Users size={28} />
            </div>
            <div>
              <p className="text-2xl font-bold">{dashData.customer}</p>
              <p className="text-sm text-gray-300">Customers</p>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:bg-white/20 transition">
            <div className="p-3.5 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/10">
              <IndianRupee size={28} />
            </div>
            <div>
              <p className="text-2xl font-bold">₹{dashData.earning}</p>
              <p className="text-sm text-gray-300">Total Revenue</p>
            </div>
          </div>
        </div>  

        {/* Latest Bookings */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-3">
            <ClipboardList size={22} className="text-pink-400" />
            <p className="text-lg font-semibold">Latest <span className="text-pink-500">Bookings</span></p>
          </div>

          <div className="space-y-4">
            {dashData.lastbookings.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white/5 hover:bg-white/10 transition rounded-xl p-4"
              >
                {/* Barber Info */}
                <div className="flex items-center gap-3">
                  {/* Hindi Comment: local key ko mapper dictionary se load kiya ya directly Cloudinary URL link retrieve kiya */}
                  <img
                    src={barberImages[item.barberData.image] || item.barberData.image}
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
                  <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-semibold">
                    <XCircle size={14} />
                    Cancelled
                  </span>
                ) : item.isCompleted ? <p className='text-green-500 text-xs font-medium'>Completed</p>: (
                  <button
                    onClick={() => cancelBooking(item._id, aToken)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-pink-500/10 hover:bg-pink-600 text-pink-400 hover:text-white border border-pink-500/20 hover:border-transparent transition-all duration-300 text-xs font-semibold shadow-sm cursor-pointer"
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
    ) : (
      <div className="p-6 text-white min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading dashboard...</p>
      </div>
    )
  )
}

export default Dashboard
