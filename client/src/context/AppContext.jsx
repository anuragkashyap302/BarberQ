import { createContext, useEffect, useState } from "react";
// import { barbers } from "../assets/assets";
import axios from "axios";
import { toast } from 'react-toastify';


export const AppContext = createContext();

const AppContextProvider = (props)=>{

const backendURL = import.meta.env.VITE_BACKEND_URL;
const [barbers , setBarbers] = useState([]);
const [token , setToken] = useState(localStorage.getItem('token')? localStorage.getItem('token'): false)
const [userData , setUserData] = useState(false)
   
  const getBarbersData = async ()=>{
   try {
      const {data} = await axios.get(backendURL+"/api/barber/list");
      if(data.success){
        setBarbers(data.barbers);
        
      } else{
        toast.error(data.message);
      }
   } catch (error) {
        console.log("Error while fetching barbers data", error);
        toast.error(error.message);
   }
  }

  const userProfileData = async()=>{
    try {
      const {data} = await axios.get(backendURL + '/api/user/get-profile' , {headers:{token}})
    if(data.success){
      setUserData(data.userData)
    } else{
       toast.error(data.message)
    }
    } catch (error) {
      console.log("Error while fetching User data", error);
        toast.error(error.message);
    }
  }
    const value = {
    barbers,getBarbersData ,token ,setToken,backendURL, userData,setUserData, userProfileData
}
    useEffect(()=>{
        getBarbersData();
    },[])

    useEffect(()=>{
    if(token){
      userProfileData()
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

