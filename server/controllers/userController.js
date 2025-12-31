
import validator from 'validator'
import bcrypt from 'bcrypt'
import UserModel from '../models/userModel.js';
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import bookingModel from '../models/bookingModel.js';
import BarberModel from '../models/barbermodel.js';
import razorpay from 'razorpay';
import dotenv from 'dotenv';
//api to resitter user
const registerUser = async (req , res) =>{
    try {
        const {name , email , password} = req.body;
        if(!name || !password || !email){
            return res.json({success:false , message:"Missing Details"})
        }
        if(!validator.isEmail(email)){
             return res.json({success:false , message:"Email is not valid"})
        }

        if( password.length < 6){
             return res.json({success:false , message:"Enter a Strong Password"})
        }
        // hassing userpassword
        const salt =  await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email, 
            password: hashedPassword
        }
        const newUser = new  UserModel(userData)
        const user = await newUser.save()
        // _id 

const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
   res.json({success:true , token})
    } catch (error) {
        console.log(error);
        res.json({success:false  , message:error.message})
        
    }
}

// api for user login
const loginUser = async (req , res)=>{
    try {
        const {email , password} = req.body;
        const user = await UserModel.findOne({email})
        if(!user){
            return res.json({success:false , message:"User does not exist"})
        }
        const isMatched = await bcrypt.compare(password, user.password);

        if(isMatched){
            const token = jwt.sign({id:user._id} , process.env.JWT_SECRET)
            res.json({success:true , token})
        } else{
            res.json({success:false , message: "Invalid Credantials"})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false  , message:error.message})
    }
}

 // api to get user profile data
const getProfile = async (req, res) => {
  try {
    const userId = req.userId; // ✅ take from req (set in middleware)
    const userData = await UserModel.findById(userId).select("-password");
    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

 const updateProfile = async (req , res)=>{
     try {
        const {userId , name , phone , address , dob , gender} = req.body
        const imageFile = req.file
        if(!name || !phone || !dob || !gender){
            return res.json({success:false , message: "Data Missing"})
        }
        await UserModel.findByIdAndUpdate(userId,{name , phone , address:JSON.parse(address),dob,gender})
        if(imageFile){
            // upload image to couludingary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path ,{resource_type: 'image'})
            const imageurl = imageUpload.secure_url
             await UserModel.findByIdAndUpdate(userId,{image:imageurl})
        }
        res.json({success:true , message:"Profile Updated"})
     } catch (error) {
        console.log(error);
        res.json({success:false  , message:error.message})
        
     }
 }
 // api to booking a slot
 const bookSlot = async (req , res)=>{
    try {
        const {userId , barberId , slotDate , slotTime} = req.body;
        const barberData = await  BarberModel.findById(barberId).select("-password") 
        if(!barberData.available){
            return res.json({success:false , message:"Barber is not available"})    
        }
         let slots_booked = barberData.slots_booked;
         // check if the slot is already booked
         if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime)){
                return res.json({success:false , message:"Slot is already booked"})
            } else{
                slots_booked[slotDate].push(slotTime)
            }
         } else{
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
         }
          const userData = await UserModel.findById(userId).select("-password")
            delete barberData.slots_booked

            const bookingData = {
                userId,
                barberId,
                userData,
                barberData,
                amount: barberData.fees,
                slotTime,
                slotDate,
                date: Date.now()
            }

            const newBooking = new bookingModel(bookingData)
            await newBooking.save()

            await BarberModel.findByIdAndUpdate(barberId , {slots_booked})
            res.json({success:true , message:"Slot Booked Successfully"})
            

    } catch (error) {
         console.log(error);
        res.json({success:false  , message:error.message})
    }
 }
// api to get user booking

 const listBookings = async (req , res)=>{
    try {
         const userId = req.userId;
         const bookings = await bookingModel.find({userId}).sort({date:-1})
            res.json({success:true , bookings})
        
    } catch (error) {
         console.log(error);
        res.json({success:false  , message:error.message})
    }
 }
 // api to cancel booking
 const cancelBooking = async (req, res) => {
  try {
    const userId = req.userId;  // ✅ take from auth middleware
    const { bookingId } = req.body;

    const bookingData = await bookingModel.findById(bookingId);
    if (!bookingData) {
      return res.json({ success: false, message: "Booking not found" });
    }

    if (bookingData.userId.toString() !== userId.toString()) {
      return res.json({ success: false, message: "You are not authorized to cancel this booking" });
    }

    await bookingModel.findByIdAndUpdate(bookingId, { cancelled: true });

    // resling barber slots_booked
    const { barberId, slotDate, slotTime } = bookingData;
    const barberData = await BarberModel.findById(barberId);

    if (barberData && barberData.slots_booked[slotDate]) {
      let slots_booked = barberData.slots_booked;
      slots_booked[slotDate] = slots_booked[slotDate].filter(slot => slot !== slotTime);

      await BarberModel.findByIdAndUpdate(barberId, { slots_booked });
    }

    res.json({ success: true, message: "Booking Cancelled Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// api to make payemt razorpay
const paymentRazorpay = async (req , res)=>{
   try {
     const {bookingId} = req.body
    const bookingData = await bookingModel.findById(bookingId)
    if(!bookingData || bookingData.cancelled){
        return res.json({success:false , message:"Booking Cancelled Or not found"})
    }
    // create optin for razorpay
    const options = {
        amount: bookingData.amount * 100, // amount in the smallest currency unit
        currency: process.env.CURRENCY,
        receipt: `receipt_order_${bookingId}`
    }
    // creation of an order
    const order = await razorpayInstance.orders.create(options)
    res.json({success:true , order})
    
   } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
    
   }
}
// api to veryqfy payment
const verifyRazorpay = async (req , res)=>{
     try {
        const {razorpay_order_id } = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        // console.log(orderInfo);
        if(orderInfo.status === 'paid'){
            await bookingModel.findOneAndUpdate({ _id: orderInfo.receipt.split('receipt_order_')[1] }, { payment: true });
            return res.json({success:true , message:"Payment Successfull"})
        } else{
            return res.json({success:false , message:"Payment Failed"})

        }

        
     } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
     }
}

export {registerUser, loginUser, getProfile , updateProfile , bookSlot , listBookings, cancelBooking, paymentRazorpay, verifyRazorpay}