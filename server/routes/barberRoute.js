import express from 'express';
const barberRouter = express.Router();
import { barberlist, barberLogin, getBarberBookings, CompleteBooking, CancelBooking, barberDashboard, barberProfile, updateBarberProfile, getServices } from '../controllers/barberController.js';
import authBarber from '../middlewares/authBarber.js';
import cacheMiddleware from '../middlewares/cacheMiddleware.js';
import { authLimiter } from '../middlewares/rateLimiter.js';

// Heavy Read Route  Barbers list ko 30 minutes  ke liye Redis me cache kiya
barberRouter.get('/list', cacheMiddleware(1800, 'barbers_list'), barberlist);

// Services list ko 1 hour  ke liye Redis me cache kiya
barberRouter.get('/services', cacheMiddleware(3600, 'services_list'), getServices);

// Hindi Comment: Barber login endpoint pe password guessing rokne ke liye rate limiter lagaya
barberRouter.post('/login', authLimiter, barberLogin);
barberRouter.get('/bookings', authBarber, getBarberBookings);
barberRouter.post('/complete-booking', authBarber, CompleteBooking);
barberRouter.post('/cancel-booking', authBarber, CancelBooking);
barberRouter.get('/dashboard', authBarber, barberDashboard);
barberRouter.get('/profile', authBarber, barberProfile);
barberRouter.post('/update-profile', authBarber, updateBarberProfile);

export default barberRouter;