import { createContext } from "react";

export const AppContext  = createContext()

const AppContextProvider = (props) => {
    const calcuateAge = (dob)=>{
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        return age;
    }

    const monthes = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const slotDateFormat = (slotDate)=>{
        const dateArray = slotDate.split("-");
        return dateArray[0] + " " + monthes[Number(dateArray[1])] + " " + dateArray[2];
    }
   const value = {
     calcuateAge, slotDateFormat
   }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider