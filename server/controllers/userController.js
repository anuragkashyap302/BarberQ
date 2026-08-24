
import validator from 'validator'
import bcrypt from 'bcrypt'
import UserModel from '../models/userModel.js';
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import bookingModel from '../models/bookingModel.js';
import BarberModel from '../models/barbermodel.js';
import razorpay from 'razorpay';
import dotenv from 'dotenv';
import transporter from "../config/nodemailer.js";
//api to resitter user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !password || !email) {
            return res.json({ success: false, message: "Missing Details" })
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Email is not valid" })
        }

        if (password.length < 6) {
            return res.json({ success: false, message: "Enter a Strong Password" })
        }
        // hassing userpassword
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword
        }
        const newUser = new UserModel(userData)
        const user = await newUser.save()
        // _id 

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        res.json({ success: true, token })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })

    }
}

// api for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "User does not exist" })
        }
        const isMatched = await bcrypt.compare(password, user.password);

        if (isMatched) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid Credantials" })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// api to get user profile data
const getProfile = async (req, res) => {
    try {
        const userId = req.userId; // take from req (set in middleware)
        const userData = await UserModel.findById(userId).select("-password");
        res.json({ success: true, userData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, phone, address, dob, gender } = req.body
        const userId = req.userId
        const imageFile = req.file
        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" })
        }
        await UserModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })
        if (imageFile) {
            // upload image to cloudinary
            const imageBase64 = `data:${imageFile.mimetype};base64,${imageFile.buffer.toString('base64')}`
            const imageUpload = await cloudinary.uploader.upload(imageBase64, { resource_type: 'image' })
            const imageurl = imageUpload.secure_url
            await UserModel.findByIdAndUpdate(userId, { image: imageurl })
        }
        res.json({ success: true, message: "Profile Updated" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })

    }
}
// api to booking a slot
// Yeh function client dwara appointment slot aur service book karne ke liye hai
const bookSlot = async (req, res) => {
    try {
        const { userId, barberId, slotDate, slotTime, serviceId, serviceName } = req.body;
        const barberData = await BarberModel.findById(barberId).select("-password").populate("services")
        if (!barberData.available) {
            return res.json({ success: false, message: "Barber is not available" })
        }
        let slots_booked = barberData.slots_booked;
        // check if the slot is already booked
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: "Slot is already booked" })
            } else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }
        const userData = await UserModel.findById(userId).select("-password")
        delete barberData.slots_booked

        const selectedServiceObj = barberData.services.find(s => s._id.toString() === serviceId);
        const amount = selectedServiceObj ? selectedServiceObj.price : barberData.fees;

        const bookingData = {
            userId,
            barberId,
            userData,
            barberData,
            serviceId,
            serviceName,
            amount,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newBooking = new bookingModel(bookingData)
        await newBooking.save()
        // mail send kar do 
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: userData.email,
            subject: "Barber Appointment Confirmed",

            html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Appointment Confirmed</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f3f4f6;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .email-card {
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
    }
    .header {
      background-color: #111827;
      padding: 32px 24px;
      text-align: center;
      position: relative;
    }
    .brand {
      color: #ffffff;
      font-size: 28px;
      font-weight: 800;
      margin: 0;
      letter-spacing: 0.5px;
    }
    .brand span {
      color: #ec4899;
    }
    .accent-bar {
      height: 4px;
      background: linear-gradient(to right, #ec4899, #eab308);
    }
    .content {
      padding: 32px 24px;
    }
    .success-badge {
      background-color: #ecfdf5;
      color: #059669;
      display: inline-block;
      padding: 6px 16px;
      border-radius: 9999px;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 20px;
    }
    h2 {
      color: #111827;
      font-size: 22px;
      font-weight: 700;
      margin-top: 0;
      margin-bottom: 12px;
    }
    p {
      color: #4b5563;
      font-size: 16px;
      line-height: 1.6;
      margin-top: 0;
      margin-bottom: 24px;
    }
    .details-box {
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 28px;
    }
    .details-row {
      display: table;
      width: 100%;
      margin-bottom: 12px;
    }
    .details-row:last-child {
      margin-bottom: 0;
      padding-top: 12px;
      border-top: 1px dashed #e5e7eb;
    }
    .details-label {
      display: table-cell;
      color: #6b7280;
      font-size: 14px;
      font-weight: 500;
      width: 35%;
    }
    .details-value {
      display: table-cell;
      color: #111827;
      font-size: 15px;
      font-weight: 600;
      text-align: right;
    }
    .details-value.highlight {
      color: #ec4899;
      font-size: 18px;
    }
    .footer {
      text-align: center;
      padding: 24px;
      font-size: 13px;
      color: #9ca3af;
    }
    .footer a {
      color: #ec4899;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="email-card">
      <div class="header">
        <h1 class="brand">Barber<span style="color: #ec4899;">Q</span></h1>
      </div>
      <div class="accent-bar"></div>
      <div class="content">
        <div class="success-badge">Booking Confirmed</div>
        <h2>Appointment Secured!</h2>
        <p>Hello <strong>${userData.name}</strong>,</p>
        <p>Your appointment with BarberQ has been successfully booked. Please check the booking details below:</p>
        
        <div class="details-box">
          <div class="details-row">
            <div class="details-label">Booking ID</div>
            <div class="details-value" style="font-family: monospace; font-size: 13px; color: #4b5563;">${newBooking._id}</div>
          </div>
          <div class="details-row">
            <div class="details-label">Barber</div>
            <div class="details-value">${barberData.name}</div>
          </div>
          <div class="details-row">
            <div class="details-label">Date</div>
            <div class="details-value">${slotDate}</div>
          </div>
          <div class="details-row">
            <div class="details-label">Time</div>
            <div class="details-value">${slotTime}</div>
          </div>
          <div class="details-row">
            <div class="details-label">Amount</div>
            <div class="details-value highlight">₹${barberData.fees}</div>
          </div>
        </div>
    
        <p style="margin-bottom: 0; font-size: 14px; color: #6b7280; text-align: center; margin-top: 24px;">
          Thank you for choosing BarberQ. We look forward to styling you!
        </p>
      </div>
    </div>
    <div class="footer">
      <p>© 2026 BarberQ. All rights reserved.</p>
      <p>Need support? Contact us at <a href="mailto:support@barberq.com">support@barberq.com</a></p>
    </div>
  </div>
</body>
</html>`
        };

        await transporter.sendMail(mailOptions);

        await BarberModel.findByIdAndUpdate(barberId, { slots_booked })
        res.json({ success: true, message: "Slot Booked Successfully" })


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}
// api to get user booking

const listBookings = async (req, res) => {
    try {
        const userId = req.userId;
        const bookings = await bookingModel.find({ userId }).sort({ date: -1 })
        res.json({ success: true, bookings })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
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
        const userData = await UserModel.findById(bookingData.userId);

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
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: userData.email,
            subject: "Appointment Cancelled",

            html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Appointment Cancelled</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f3f4f6;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .email-card {
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
    }
    .header {
      background-color: #111827;
      padding: 32px 24px;
      text-align: center;
      position: relative;
    }
    .brand {
      color: #ffffff;
      font-size: 28px;
      font-weight: 800;
      margin: 0;
      letter-spacing: 0.5px;
    }
    .accent-bar {
      height: 4px;
      background: #f43f5e;
    }
    .content {
      padding: 32px 24px;
    }
    .cancel-badge {
      background-color: #fff1f2;
      color: #e11d48;
      display: inline-block;
      padding: 6px 16px;
      border-radius: 9999px;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 20px;
    }
    h2 {
      color: #111827;
      font-size: 22px;
      font-weight: 700;
      margin-top: 0;
      margin-bottom: 12px;
    }
    p {
      color: #4b5563;
      font-size: 16px;
      line-height: 1.6;
      margin-top: 0;
      margin-bottom: 24px;
    }
    .details-box {
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 28px;
    }
    .details-row {
      display: table;
      width: 100%;
      margin-bottom: 12px;
    }
    .details-row:last-child {
      margin-bottom: 0;
    }
    .details-label {
      display: table-cell;
      color: #6b7280;
      font-size: 14px;
      font-weight: 500;
      width: 35%;
    }
    .details-value {
      display: table-cell;
      color: #111827;
      font-size: 15px;
      font-weight: 600;
      text-align: right;
    }
    .footer {
      text-align: center;
      padding: 24px;
      font-size: 13px;
      color: #9ca3af;
    }
    .footer a {
      color: #ec4899;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="email-card">
      <div class="header">
        <h1 class="brand">Barber<span style="color: #ec4899;">Q</span></h1>
      </div>
      <div class="accent-bar"></div>
      <div class="content">
        <div class="cancel-badge">Cancelled Successfully</div>
        <h2>Appointment Cancelled</h2>
        <p>Hello <strong>${userData.name}</strong>,</p>
        <p>Your appointment has been cancelled successfully. Here are the details of the cancelled booking:</p>
        
        <div class="details-box">
          <div class="details-row">
            <div class="details-label">Booking ID</div>
            <div class="details-value" style="font-family: monospace; font-size: 13px; color: #4b5563;">${bookingData._id}</div>
          </div>
          <div class="details-row">
            <div class="details-label">Barber</div>
            <div class="details-value">${barberData.name}</div>
          </div>
          <div class="details-row">
            <div class="details-label">Date</div>
            <div class="details-value">${slotDate}</div>
          </div>
          <div class="details-row">
            <div class="details-label">Time</div>
            <div class="details-value">${slotTime}</div>
          </div>
        </div>

        <p style="margin-bottom: 0; font-size: 14px; color: #6b7280; text-align: center; margin-top: 24px;">
          If this cancellation was accidental, you can book another appointment anytime. We'd love to see you back!
        </p>
      </div>
    </div>
    <div class="footer">
      <p>© 2026 BarberQ. All rights reserved.</p>
      <p>Need support? Contact us at <a href="mailto:support@barberq.com">support@barberq.com</a></p>
    </div>
  </div>
</body>
</html>`
        };

        await transporter.sendMail(mailOptions);
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
const paymentRazorpay = async (req, res) => {
    try {
        const { bookingId } = req.body
        const bookingData = await bookingModel.findById(bookingId)
        if (!bookingData || bookingData.cancelled) {
            return res.json({ success: false, message: "Booking Cancelled Or not found" })
        }
        // create optin for razorpay
        const options = {
            amount: bookingData.amount * 100, // amount in the smallest currency unit
            currency: process.env.CURRENCY,
            receipt: `receipt_order_${bookingId}`
        }
        // creation of an order
        const order = await razorpayInstance.orders.create(options)
        res.json({ success: true, order })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });

    }
}
// api to veryqfy payment
const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        // console.log(orderInfo);
        if (orderInfo.status === 'paid') {
            await bookingModel.findOneAndUpdate({ _id: orderInfo.receipt.split('receipt_order_')[1] }, { payment: true });
            return res.json({ success: true, message: "Payment Successfull" })
        } else {
            return res.json({ success: false, message: "Payment Failed" })

        }


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { registerUser, loginUser, getProfile, updateProfile, bookSlot, listBookings, cancelBooking, paymentRazorpay, verifyRazorpay }