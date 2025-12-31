import express from 'express';
import { addBarber ,adminDashboard,allBarbers,BookingCancel,bookingsAdmin,loginAdmin} from '../controllers/adminController.js';
import upload from '../middlewares/multer.js';
import authAdmin from '../middlewares/authAdmin.js';
import { changeAvailability } from '../controllers/barberController.js';


const adminRouter = express.Router();

adminRouter.post('/add-barber',authAdmin , upload.single('image'), addBarber);
adminRouter.post('/login', loginAdmin);
adminRouter.post('/all-barbers',authAdmin, allBarbers)
adminRouter.post('/change-availability', authAdmin, changeAvailability);
adminRouter.get('/all-bookings', authAdmin,  bookingsAdmin);
adminRouter.post('/booking-cancel', authAdmin,  BookingCancel);
adminRouter.get('/dashboard', authAdmin,  adminDashboard);

export default adminRouter;