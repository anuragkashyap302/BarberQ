import { useState, useEffect } from "react";
import { createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
export const BarberContext  = createContext()

const BarberContextProvider = (props) => {
    const backendURL = import.meta.env.VITE_BACKEND_URL
    const [bToken , setBToken] = useState(localStorage.getItem('bToken') ? localStorage.getItem('bToken') : '')
    const [bookings , setBookings] = useState([])
    const [dashData , setDashData] = useState(false)
    const [profileData , setProfileData] = useState(false)

    const getBookings = async(token) => {
         try {
            const {data}  = await axios.get(backendURL + '/api/barber/bookings',{headers:{bToken: token} })
            if(data.success){
                setBookings(data.bookings.reverse())
                console.log(data.bookings);
                
            } else{
                toast.error(data.message)
            }
         } catch (error) {
            console.log(error);
            toast.error(error.message)
         }
    }
     
    const completeBooking = async(bookingId, token) => {
         try {
            const {data}  = await axios.post(backendURL + '/api/barber/complete-booking',{ bookingId},{headers:{bToken: token} })
            if(data.success){
                toast.success(data.message)
                getBookings(token)
            }else{
                toast.error(data.message)
            }
         } catch (error) {
            console.log(error);
            toast.error(error.message)
         }
    }
     const cancelBooking = async(bookingId, token) => {
         try {
            const {data}  = await axios.post(backendURL + '/api/barber/cancel-booking',{ bookingId},{headers:{bToken: token} })
            if(data.success){
                toast.success(data.message)
                getBookings(token)
            }else{
                toast.error(data.message)
            }
         } catch (error) {
            console.log(error);
            toast.error(error.message)
         }
    }

    const getDashData = async(token) => {
        try {
            const {data}  = await axios.get(backendURL + '/api/barber/dashboard',{headers:{bToken: token} })
            if(data.success){
                setDashData(data.dashData)
                console.log(data.dashData);
            } else{
                toast.error(data.message)
            }
            
        } catch (error) {
             console.log(error);
            toast.error(error.message)
            
        }
    }

    const getProfileData = async(token) => {
        try {
            const {data}  = await axios.get(backendURL + '/api/barber/profile',{headers:{bToken: token} })
            if(data.success){
                 setProfileData(data.profileData)   // ✅ use correct key kyki backent se profileData name hi bhej rahe hai to yaha bhi same use karna hia nahi to error
               console.log(data.profileData); 
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }
   const value = {
    backendURL , bToken , setBToken,bookings,setBookings,getBookings, completeBooking, cancelBooking, dashData,setDashData, getDashData, profileData, setProfileData,getProfileData
   }

    return (
        <BarberContext.Provider value={value}>
            {props.children}
        </BarberContext.Provider>
    )
}

export default BarberContextProvider