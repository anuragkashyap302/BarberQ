import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const MyBooking = () => {
  const { backendURL , token,getBarbersData } = useContext(AppContext);
  const [bookings, setBookings] = useState([])
  const navigate = useNavigate();
  const getUserBookings = async()=>{
    try {
       const {data} = await axios.get(backendURL + '/api/user/bookings' , {headers:{token}})
        if(data.success){
          setBookings(data.bookings)
          console.log(data);
          
        }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      
    }
  }
  const cancelBooking = async(bookingId)=>{
    try {
      const {data} = await axios.post(backendURL + '/api/user/cancel-booking' , {bookingId} , {headers:{token}})
      if(data.success){
        toast.success(data.message)
        getUserBookings()
        getBarbersData()
      }else{
        toast.error(data.message)
      }
      
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      
    }
    
  }
   const initPay = (order)=>{
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
        amount: order.amount,
        currency: order.currency,
        name: "BarberQ",
        description: "Booking Payment",
        order_id: order.id,
        receipt: order.receipt,
        handler: async (response)=>{
          console.log(response);
           try {
            const {data} = await axios.post(backendURL + '/api/user/verify-razorpay' , {...response} , {headers:{token}})
            if(data.success){
              
              getUserBookings()
              navigate('/my-bookings')
            } 
           } catch (error) {
            console.log(error);
            toast.error(error.message);
           }
        }
      }
      const rzp = new window.Razorpay(options);
      rzp.open();
   }
   // abhi ye kaam nahi karga kyki razoary me kyc karna padaga
   const bookingRazorpay = async(bookingId)=>{
     try {
       const {data} = await axios.post(backendURL + '/api/user/payment-razorpay' , {bookingId} , {headers:{token}})
        if(data.success){
          // console.log(data.order);
          initPay(data.order)
        } else{
          toast.error(data.message)
           
        }
     } catch (error) {
      console.log(error);
      toast.error(error.message);
      
     }
   }
  // ek fuction likna hai jo date ko acche se show kare
   useEffect(()=>{
    if(token){
      getUserBookings()
    }
    },[token])
  return (
    <div className="py-10 px-4 max-w-7xl mx-auto mt-16">
      {/* Page Title */}
      
      <h2 className="text-3xl font-bold text-pink-400 mb-8 text-center drop-shadow-md">
        My Bookings
      </h2>
{/* jo bhi item humko mila uske ander ek object barberData joki bookig model se aa raha hai that why item.barberrData.anyting */}
      {/* Booking Cards */}
      <div className="grid sm:grid-cols-2 gap-6">
        {bookings.map((item, index) => (
          <div
            key={index}
            className="relative rounded-2xl p-6 shadow-xl border border-white/20 
                       bg-gradient-to-tr from-white/10 to-white/5 
                       backdrop-blur-lg hover:scale-[1.02] transition-transform"
          >
            {/* Image */}
            <div className="h-56 w-full overflow-hidden rounded-xl">
              <img
                src={item.barberData.image}
                alt={item.barberData.name}
                className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Details */}
            <div className="p-5 space-y-2">
              <h2 className="text-xl font-semibold text-white drop-shadow-sm">
                {item.barberData.name}
              </h2>
              <p className="text-sm text-gray-200">{item.barberData.services}</p>

              <p className="text-lg font-bold text-pink-400">₹{item.barberData.fees}</p>

              <div className="text-sm text-gray-200">
                <p className="font-medium text-white">Address:</p>
                <p>{item.barberData.address.line1}</p>
                <p>{item.barberData.address.line2}</p>
              </div>

              <p className="text-sm text-gray-200">
                <span className="font-semibold text-pink-300">Date & Time:</span>{item.slotDate} | {item.slotTime}
               
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center px-5 pb-5">
              {/* {!item.cancelled && item.payment && <button>Paid</button>}  ye kaam karga jab payemet ho jaye */}
         {!item.cancelled && !item.payment && !item.isCompleted &&  <button /* onClick={()=> bookingRazorpay(item._id)} */  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm shadow-md transition cursor-pointer">
                Pay Online
              </button> }     
              {!item.cancelled && !item.isCompleted && <button onClick={()=> cancelBooking(item._id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm shadow-md transition cursor-pointer">
                Cancel Booking
              </button>}
             {item.cancelled && !item.isCompleted && (
  <span className="inline-block bg-red-100 text-red-600 font-bold px-4 py-2 rounded-xl shadow-md border border-red-300 animate-pulse">
    Booking Cancelled
  </span>
  
)}
 {item.isCompleted && <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">Completed</button>}
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
};

export default MyBooking;
