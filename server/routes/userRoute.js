import express from "express";
import { registerUser, loginUser, getProfile, updateProfile, bookSlot, listBookings, cancelBooking, paymentStripe, verifyStripe, getQueuePosition, getChatHistory } from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/get-profile", authUser, getProfile);
userRouter.post("/update-profile", upload.single("image"), authUser, updateProfile);
userRouter.post("/book-slot", authUser, bookSlot);
userRouter.get('/bookings', authUser, listBookings);
userRouter.post('/cancel-booking', authUser, cancelBooking);

// Stripe payment trigger karne ka route (unpaid bookings ke liye)
userRouter.post('/payment-stripe', authUser, paymentStripe);

// Stripe response verify karne ka route
userRouter.post('/verify-stripe', authUser, verifyStripe);

// Live queue tracker API endpoint path
userRouter.get('/queue-position/:bookingId', authUser, getQueuePosition);

// Chat messages load history path
userRouter.get('/messages/:bookingId', authUser, getChatHistory);

export default userRouter;
