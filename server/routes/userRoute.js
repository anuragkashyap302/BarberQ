import express from "express";
import { registerUser, loginUser, forgotPassword, getProfile, updateProfile, bookSlot, listBookings, cancelBooking, paymentStripe, verifyStripe, getQueuePosition, getChatHistory } from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";

import { authLimiter, bookingLimiter } from "../middlewares/rateLimiter.js";

const userRouter = express.Router();

// Rate limiter attach kiya credential brute force aur slot spamming rokne ke liye
userRouter.post("/register", authLimiter, registerUser);
userRouter.post("/login", authLimiter, loginUser);
userRouter.post("/forgot-password", authLimiter, forgotPassword);
userRouter.get("/get-profile", authUser, getProfile);
userRouter.post("/update-profile", upload.single("image"), authUser, updateProfile);
userRouter.post("/book-slot", authUser, bookingLimiter, bookSlot);
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
