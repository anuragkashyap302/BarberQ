import React from 'react'
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
import { useContext } from 'react';
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import AllBooking from './pages/Admin/AllBooking';
import AddBarber from './pages/Admin/AddBarber';
import BarberList from './pages/Admin/BarberList';
import { BarberContext } from './context/BarberContext';
import BarberDashboard from './pages/Barber/BarberDashboard';
import BarberBookings from './pages/Barber/BarberBookings';
import BarberProfile from './pages/Barber/BarberProfile';

const App = () => {

  const {aToken} = useContext(AdminContext)
  const {bToken} = useContext(BarberContext)
  return aToken || bToken ? (
    <div className='bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#2c1b1b] min-h-screen'>
     <ToastContainer/>
    <Navbar/>
    <div className='flex items-start'>
      <Sidebar/>
      <Routes>
        {/* admin routes */}
        <Route path='/' element={<></>}/>
        <Route path='/admin-dashboard' element={<Dashboard/>}/>
        <Route path='/all-booking' element={<AllBooking/>}/>
        <Route path='/add-barber' element={<AddBarber/>}/>
        <Route path='/barber-list' element={<BarberList/>}/>
        {/* barber routes */}
        <Route path='/barber-dashboard' element={<BarberDashboard/>}/>
        <Route path='/barber-bookings' element={<BarberBookings/>}/>
        <Route path='/barber-profile' element={<BarberProfile/>}/>
        
      </Routes>
    </div>
    </div>
  ) : (
   <>
    <Login/>
    <ToastContainer/>
   </>
  )
}

export default App
