
import BarberModel from "../models/barbermodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import bookingModel from "../models/bookingModel.js";
import ServiceModel from "../models/serviceModel.js";
const changeAvailability = async (req, res) => {
    try {
        const { barberId } = req.body;

        const barber = await BarberModel.findById(barberId);
        await BarberModel.findByIdAndUpdate(barberId, { available: !barber.available });
        res.json({ success: true, message: "Barber availability updated successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const barberlist =  async (req , res)=>{
    try {
        const barbers = await BarberModel.find({}).select(['-password' , '-email']).populate('services')
        res.json({success: true , barbers})
    } catch (error) {
         res.json({ success: false, message: error.message });
    }
}
// api for barber login
const barberLogin = async (req, res) => {
     try {
            const { email, password } = req.body;
            const barber = await BarberModel.findOne({ email});
            if(!barber) {
              return  res.json({ success: false, message: "Invalid email or password" });
            } 
            const isMatch = await bcrypt.compare(password, barber.password);
            if(isMatch){
                const token  = jwt.sign({id:barber._id} , process.env.JWT_SECRET)
                res.json({success: true , token})
            } else{
                res.json({ success: false, message: "Invalid email or password" });
            }
        
     } catch (error) {
         console.log(error);
        res.json({ success: false, message: error.message });
     }
}
 // api for get booking for a barber
 const getBarberBookings = async (req, res) => {
    try {
        const barberId = req.barberId; // agar req.body hai to {object} = req.body nahi to simple samy barber kiye na yaha bbhi
        const bookings = await bookingModel.find({ barberId })
        // yaha pe .populate karke user ka data bhi bhej skte all though bookings contain all things
        
         
        
        res.json({ success: true, bookings })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
        
    }
 }
 // api to mark booking as completed or cancelled
 const CompleteBooking = async (req, res) => {
    try {
        const barberId = req.barberId;
        const { bookingId} = req.body;
        const booking = await bookingModel.findById(bookingId)
        if(booking && booking.barberId == barberId){ 
            await bookingModel.findByIdAndUpdate(bookingId, { isCompleted: true });

            // Queue status realtime dashboard updating ke liye notification check kiya
            req.io.to(`barber_${barberId}`).emit('queue_update');

            return res.json({ success: true, message: "Booking  Completed" });
        }else{
            return res.json({ success: false, message: "Mark Falied" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
 }

 const CancelBooking = async (req, res) => {
    try {
        const barberId = req.barberId;
        const { bookingId} = req.body;
        const booking = await bookingModel.findById(bookingId)
        if(booking && booking.barberId == barberId){ 
            await bookingModel.findByIdAndUpdate(bookingId, { cancelled: true });

            // Slots ko dynamically pull (release) karne ke liye query update context run kiya
            await BarberModel.findByIdAndUpdate(barberId, {
                $pull: { [`slots_booked.${booking.slotDate}`]: booking.slotTime }
            });

            // Sockets event emit kiya slot release and queue positions recalculate karne ke liye
            req.io.to(`barber_${barberId}`).emit('slot_update', { 
                slotDate: booking.slotDate, 
                slotTime: booking.slotTime, 
                action: 'release' 
            });
            req.io.to(`barber_${barberId}`).emit('queue_update');

            return res.json({ success: true, message: "Booking  Cancelled" });
        }else{
            return res.json({ success: false, message: "Cancelation Falied" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
 }

 // api to get dashboard data for barber
 const barberDashboard = async (req, res) => {
     try {
        const barberId = req.barberId;
        const totalBookings = await bookingModel.find({barberId})
        let earnings = 0;
        totalBookings.map((item)=>{
            if(item.isCompleted || item.payment){
                earnings += item.amount
            }
             
        })
        let customers = [];
          totalBookings.map((item)=>{
               if(!customers.includes(item.userId)){
                 customers.push(item.userId)
               }
             })

             const dashData = {
                 earnings  ,
                 totalBookings: totalBookings.length,
                 customers: customers.length,
                 latestBooking: totalBookings.reverse().slice(0,5)
             }

     res.json({success: true , dashData})
        
     } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
        
     }
 }
 // api to barber profile
 const barberProfile = async (req , res)=>{
    try {
        const barberId = req.barberId; 
        const profileData = await BarberModel.findById(barberId).select('-password').populate('services')
         
        res.json({success: true , profileData})
    } catch (error) {
        res.json({ success: false, message: error.message });
        
    }

}
// api to update profile data for barber
const updateBarberProfile =  async (req , res)=>{
     try {
        const barberId = req.barberId;
        const { name,  experience, fees, about, address ,available} = req.body;
        await BarberModel.findByIdAndUpdate(barberId,{name,fees ,experience,about, address , available})
        res.json({success:true , message: "Profile Updated"})
     } catch (error) {
         console.log(error);
        res.json({ success: false, message: error.message });
        
     }
}
// Api to fetch all services
// Yeh function client ya admin ko database ke saare services list return karne ke liye hai
const getServices = async (req, res) => {
    try {
        const services = await ServiceModel.find({});
        res.json({ success: true, services });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { changeAvailability ,  barberlist,barberLogin,getBarberBookings , CompleteBooking , CancelBooking,barberDashboard, barberProfile, updateBarberProfile, getServices};