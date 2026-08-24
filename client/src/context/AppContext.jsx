import { createContext, useEffect, useState } from "react";
import { barberImages } from "../assets/assets";
import axios from "axios";
import { toast } from 'react-toastify';


export const AppContext = createContext();

const AppContextProvider = (props)=>{

const backendURL = import.meta.env.VITE_BACKEND_URL;
const [barbers , setBarbers] = useState([]);
const [services, setServices] = useState([]);
const [token , setToken] = useState(localStorage.getItem('token')? localStorage.getItem('token'): false)
const [userData , setUserData] = useState(false)
   
  const getBarbersData = async ()=>{
   try {
      const {data} = await axios.get(backendURL+"/api/barber/list");
      if(data.success){
        // Map backend string keys (barber1, barber2, etc.) to local React imports
        const formattedBarbers = data.barbers.map(b => {
          if (b.image && barberImages[b.image]) {
            return { ...b, image: barberImages[b.image] };
          }
          return b;
        });
        setBarbers(formattedBarbers);
      } else{
        toast.error(data.message);
      }
   } catch (error) {
        console.log("Error while fetching barbers data", error);
        toast.error(error.message);
   }
  }

  // Yeh function database se saare available services ko fetch karta hai
  const getServicesData = async () => {
    try {
      const { data } = await axios.get(backendURL + "/api/barber/services");
      if (data.success) {
        setServices(data.services);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error while fetching services data", error);
      toast.error(error.message);
    }
  }

  const userProfileData = async(userToken)=>{
    try {
      const {data} = await axios.get(backendURL + '/api/user/get-profile' , {headers:{token: userToken}})
      if(data.success){
        setUserData(data.userData)
      } else{
        toast.error(data.message)
         // If the token is invalid or unauthorized, clear it so the user can log in/sign up again
        setToken(false)
        localStorage.removeItem('token')
      }
    } catch (error) {
      console.log("Error while fetching User data", error);
      toast.error(error.message);
    }
  }
    const value = {
    barbers,getBarbersData ,services,getServicesData,token ,setToken,backendURL, userData,setUserData, userProfileData
}
    useEffect(()=>{
        getBarbersData();
        getServicesData();
    },[])

    useEffect(()=>{
    if(token){
      userProfileData(token)
    } else{
         setUserData(false)
    }
    },[token])
 return (
    <AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>
 )

}

export default AppContextProvider

