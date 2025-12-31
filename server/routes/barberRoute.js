import express from 'express';
const barberRouter = express.Router()
import { barberlist ,barberLogin, getBarberBookings,CompleteBooking, CancelBooking, barberDashboard, barberProfile , updateBarberProfile} from '../controllers/barberController.js';
import authBarber from '../middlewares/authBarber.js';

barberRouter.get('/list', barberlist )
barberRouter.post('/login', barberLogin )
barberRouter.get('/bookings',authBarber,getBarberBookings)
barberRouter.post('/complete-booking',authBarber,CompleteBooking)
barberRouter.post('/cancel-booking',authBarber,CancelBooking)
barberRouter.get('/dashboard' , authBarber , barberDashboard)
barberRouter.get('/profile' , authBarber , barberProfile)
barberRouter.post('/update-profile', authBarber , updateBarberProfile)
export default barberRouter