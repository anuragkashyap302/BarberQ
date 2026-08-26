import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminContext } from '../context/AdminContext'
import { BarberContext } from '../context/BarberContext'
import { 
  Calendar, 
  UserPlus, 
  Users, 
  LayoutDashboard, 
  User, 
  Sparkles,
  ArrowRight
} from 'lucide-react'

const Welcome = () => {
  const { aToken } = useContext(AdminContext)
  const { bToken } = useContext(BarberContext)
  const navigate = useNavigate()

  const role = aToken ? 'Admin' : 'Barber'

  // Shortcut items based on role isme add karte jao agar naya sidebar kuch bna to 
  const adminShortcuts = [
    {
      title: 'Admin Dashboard',
      description: 'View earnings, booking volumes, and customer trends.',
      path: '/admin-dashboard',
      icon: LayoutDashboard,
      color: 'from-pink-500 to-pink-600',
    },
    {
      title: 'Manage Bookings',
      description: 'Review client appointments and schedule slots.',
      path: '/all-booking',
      icon: Calendar,
      color: 'from-pink-600 to-pink-500',
    },
    {
      title: 'Add a Barber',
      description: 'Onboard new service providers and set pricing.',
      path: '/add-barber',
      icon: UserPlus,
      color: 'from-pink-600 to-pink-500',
    },
    {
      title: 'Barber Roster',
      description: 'Manage availability status and edit provider profiles.',
      path: '/barber-list',
      icon: Users,
      color: 'from-pink-500 to-pink-600',
    },
  ]

  const barberShortcuts = [
    {
      title: 'Barber Dashboard',
      description: 'Monitor your service earnings and total bookings.',
      path: '/barber-dashboard',
      icon: LayoutDashboard,
      color: 'from-pink-500 to-pink-600',
    },
    {
      title: 'My Appointments',
      description: 'Check your upcoming client slots and update status.',
      path: '/barber-bookings',
      icon: Calendar,
      color: 'from-pink-600 to-pink-500',
    },
    {
      title: 'Edit Profile',
      description: 'Update your pricing, bio, services, and photo.',
      path: '/barber-profile',
      icon: User,
      color: 'from-pink-600 to-pink-500',
    },
  ]

  const shortcuts = aToken ? adminShortcuts : barberShortcuts

  return (
    <div className="flex-1 p-6 md:p-12 text-white flex flex-col justify-center min-h-[calc(100vh-80px)]">
      {/* Welcome Card Container */}
      <div className="max-w-4xl mx-auto w-full space-y-8">
        
        {/* Main Greeting Banner */}
        <div className="relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-4 text-center md:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30 text-xs font-semibold uppercase tracking-wider">
              <Sparkles size={12} className="animate-pulse" />
              BarberQ Control Panel
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Welcome back, <span className="text-pink-500">{role}</span>!
            </h1>
            <p className="text-gray-300 text-sm md:text-base max-w-xl leading-relaxed">
              Your centralized hub to manage hair styling appointments, staff directories, and coordinate daily operations. Use the quick links below or the sidebar to navigate.
            </p>
          </div>

          {/* Decorative Pink Glow */}
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-pink-500/25 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Shortcut Quick Grid */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold tracking-wide text-white uppercase px-1">
            Quick <span className="text-pink-500">Actions</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shortcuts.map((item, idx) => {
              const IconComponent = item.icon
              return (
                <div 
                  key={idx}
                  onClick={() => navigate(item.path)}
                  className="group cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 hover:border-pink-500/30 rounded-2xl p-6 transition-all duration-300 flex items-start gap-4 shadow-lg hover:shadow-pink-500/5 hover:-translate-y-0.5"
                >
                  {/* Icon Wrapper */}
                  <div className={`p-3.5 rounded-xl bg-gradient-to-br ${item.color} text-white shadow-md transition-transform group-hover:scale-110 duration-300`}>
                    <IconComponent size={22} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-1">
                    <h3 className="font-semibold text-lg group-hover:text-pink-400 transition-colors flex items-center gap-1.5">
                      {item.title}
                      <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-pink-400" />
                    </h3>
                    <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Welcome
