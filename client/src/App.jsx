import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Barber from './pages/Barber'
import Login from './pages/Login'
import Contact from './pages/Contact'
import MyProfile from './pages/MyProfile'
import MyBooking from './pages/MyBooking'
import Booking from './pages/Booking'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import About from './pages/About'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // <-- No indentation here

const App = () => {
  return (
    <div>
      <ToastContainer/>
      <Navbar/>
      <Routes>
        <Route path='/' element = {<Home/>}/>
        <Route path='/barbers' element = {<Barber/>}/>
        <Route path='/barbers/:speciality' element = {<Barber/>}/>
        <Route path='/login' element = {<Login/>}/>
        <Route path='/about' element = {<About/>}/>
        <Route path='/contact' element = {<Contact/>}/>
        <Route path='/my-profile' element = {<MyProfile/>}/>
        <Route path='/my-bookings' element = {<MyBooking/>}/>
        <Route path='/booking/:barberId' element = {<Booking/>}/>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App
