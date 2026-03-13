// api for adding barber
import validator from 'validator'
 import bcrypt from 'bcrypt'
 import {v2 as cloudinary} from 'cloudinary'
import BarberModel from '../models/barbermodel.js';
import jwt from 'jsonwebtoken';
import bookingModel from '../models/bookingModel.js';
import UserModel from '../models/userModel.js';
const addBarber = async (req, res) => {
    try {
       const {name, email, password,  services, experience, about, fees, address} = req.body;
       const imagefile = req.file
    //    console.log({name, email, password, services, experience, about,  fees, address , imagefile});
      if(!name || !email || !password || !services || !experience || !about || !fees || !address){
        return res.json({success: false, message: "All fields are required"});
      }
      // validation for email
       if(!validator.isEmail(email)){
        return res.json({success: false, message: "Please enter a valid email"});
       }
       // validation for password
         if(password.length < 6){
          return res.json({success: false, message: "Please enter a strong password"});
         }

            // hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imagefile.path, {
                resource_type: 'image'
                });
                const imageUrl = imageUpload.secure_url;
            // create new barber
            const barberData = {
                name,
                email,
                password: hashedPassword,
                image: imageUrl,
                services,
                experience,
                about,
                fees,
                address: JSON.parse(address),
                date: Date.now(),
            }
            const newBarber = new BarberModel(barberData);
            await newBarber.save();
            return res.json({success: true, message: "Barber added successfully"});
    } catch (error) {
       console.log(error);
         return res.json({success: false, message: error.message});
       
    }
}

// api for admin login can be done in frontend itself using env variables
const loginAdmin = async (req, res) => {
    try {
         const {email, password} = req.body;
         if(!email || !password){
          return res.json({success: false, message: "Email and password are required"});
         }
         if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
             
                const token = jwt.sign({email}, process.env.JWT_SECRET);

                res.json({success: true,  token});
         } else{
              res.json({success: false, message: "Invalid credentials"});
         }
        
     } catch (error) {
        console.log(error);
          return res.json({success: false, message: error.message});
        
     }
}

//api to get all barbers can be done in frontend itself using env variables
const allBarbers = async (req, res) => {
    try {
             const barbers = await BarberModel.find({}).select('-password');
              res.json({success: true, barbers});
      } catch (error) {
          console.log(error);
            return res.json({success: false, message: error.message});
      }
    }

    // api to get all bokings
    const  bookingsAdmin = async (req, res) => {
       try {
         const bookings = await bookingModel.find({})
          res.json({success: true, bookings})
       } catch (error) {
        console.log(error);
            return res.json({success: false, message: error.message});
        
       }
    }
    //api for booking cacellation
     const BookingCancel = async (req, res) => {
      try {
        
        const { bookingId } = req.body;
    
        const bookingData = await bookingModel.findById(bookingId);
       
        await bookingModel.findByIdAndUpdate(bookingId, { cancelled: true });
    
        // resling barber slots_booked
        const { barberId, slotDate, slotTime } = bookingData;
        const barberData = await BarberModel.findById(barberId);
    
        
          let slots_booked = barberData.slots_booked;
          slots_booked[slotDate] = slots_booked[slotDate].filter(slot => slot !== slotTime);
    
          await BarberModel.findByIdAndUpdate(barberId, { slots_booked });
        res.json({ success: true, message: "Booking Cancelled Successfully" });

      } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
      }
    };
    // dashboad datat for admin
    const adminDashboard = async (req, res) => {
       try {
        const barbers = await BarberModel.find({});
        const  user  = await UserModel.find({});
        const bookings = await bookingModel.find({});

         const totalRevenue = bookings.reduce((acc , booking)=> acc + booking.amount , 0)
        const dashData = {
          // humlong pura detail nahi behj rahi just coutn
             barbers: barbers.length,
             bookings: bookings.length,
              customer: user.length,
              earning : totalRevenue,
              lastbookings: bookings.slice().reverse().slice(0, 5)
 // last 5 bookings
        }
        res.json({ success: true, dashData });
         
       } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
        
       }
    }

export {addBarber , loginAdmin, allBarbers, bookingsAdmin,BookingCancel,adminDashboard};