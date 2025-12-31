import { useState } from "react";
import { createContext } from "react";
import axios from "axios";
export const AdminContext  = createContext()
import { toast } from "react-toastify";
const AdminContextProvider = (props) => {

    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '');
    const [barbers, setBarbers] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [dashData, setDashData] = useState(false);
    const backendURL = import.meta.env.VITE_BACKEND_URL;
     const getAllBarbers = async()=>{
        try {
            // yha pe pagal ki tarh 1 ghata barbad kiye kiyki atoken ko object me bhejna padta hai aur hum aise hi bhej rahe teh fool
            const {data} = await axios.post( backendURL + '/api/admin/all-barbers',{}, {headers:{aToken}})
            if(data.success){
                setBarbers(data.barbers)
                console.log(data.barbers);
                
            }else{
                 toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
     }
     const changeAvailability = async(barberId) =>{
        try {
            const {data} = await axios.post( backendURL + '/api/admin/change-availability',{barberId}, {headers:{aToken}})
            if(data.success){
                toast.success(data.message)
                getAllBarbers()
            }
            else{

                    toast.error(data.message)
            }
        }
        catch (error) {
            toast.error(error.message)
        }
        }
      
      const getAllBookings = async()=>{
         try {
            const {data} = await axios.get( backendURL + '/api/admin/all-bookings', {headers:{aToken}})
            if(data.success){
                setBookings(data.bookings)
                console.log(data.bookings);
            } else{
                toast.error(data.message)
            }

         } catch (error) {
             toast.error(error.message)
         }
      }
      
      const cancelBooking = async(bookingId)=>{
        try {
            const {data} = await axios.post( backendURL + '/api/admin/booking-cancel',{bookingId}, {headers:{aToken}})
            if(data.success){
                toast.success(data.message)
                getAllBookings()
            } else{
                toast.error(data.message)
            }
        } catch (error) {
             toast.error(error.message)
        }
      }

      const getDashData = async()=>{
         try {
            const {data} = await axios.get( backendURL + '/api/admin/dashboard', {headers:{aToken}})
            if(data.success){
                setDashData(data.dashData)
                 console.log(data.dashData);
            } else{
                toast.error(data.message)
            }
         } catch (error) {
                toast.error(error.message)
         }
      }
   const value = {
    aToken, setAToken, backendURL,barbers, getAllBarbers, changeAvailability, bookings,setBookings, getAllBookings, cancelBooking, dashData, getDashData
   }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider