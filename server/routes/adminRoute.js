import express from 'express';
import { addBarber ,adminDashboard,allBarbers,BookingCancel,bookingsAdmin,loginAdmin, addService} from '../controllers/adminController.js';
import upload from '../middlewares/multer.js';
import authAdmin from '../middlewares/authAdmin.js';
import { changeAvailability } from '../controllers/barberController.js';


import { authLimiter } from '../middlewares/rateLimiter.js';

const adminRouter = express.Router();

adminRouter.post('/add-barber',authAdmin , upload.single('image'), addBarber);
adminRouter.post('/add-service', authAdmin, addService);
// Hindi Comment: Admin login endpoint pe brute-force prevention ke liye rate limiter lagaya
adminRouter.post('/login', authLimiter, loginAdmin);
adminRouter.post('/all-barbers',authAdmin, allBarbers)
adminRouter.post('/change-availability', authAdmin, changeAvailability);
adminRouter.get('/all-bookings', authAdmin,  bookingsAdmin);
adminRouter.post('/booking-cancel', authAdmin,  BookingCancel);
adminRouter.get('/dashboard', authAdmin,  adminDashboard);

export default adminRouter;