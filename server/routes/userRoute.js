import express from "express";
import { registerUser, loginUser, getProfile, updateProfile ,bookSlot, listBookings, cancelBooking, paymentRazorpay, verifyRazorpay} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/get-profile", authUser, getProfile);
userRouter.post("/update-profile", upload.single("image"), authUser, updateProfile);
userRouter.post("/book-slot", authUser, bookSlot);
userRouter.get('/bookings',authUser, listBookings);
userRouter.post('/cancel-booking',authUser, cancelBooking);
userRouter.post('/payment-razorpay', authUser, paymentRazorpay);
userRouter.post('/verify-razorpay', authUser, verifyRazorpay);
export default userRouter;
