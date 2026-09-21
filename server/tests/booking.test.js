import request from 'supertest';
import { app } from '../server.js';
import { setupTestDB } from './setup.js';
import UserModel from '../models/userModel.js';
import BarberModel from '../models/barbermodel.js';
import bookingModel from '../models/bookingModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// In-memory test DB initialize kiya
setupTestDB();

describe('Booking & Concurrency Race Condition Suite', () => {
  let userToken1;
  let userToken2;
  let userId1;
  let userId2;
  let barberId;

  beforeEach(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_key_123';

    // 1. Test User 1 banaya
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const user1 = await UserModel.create({
      name: 'Aman Verma',
      email: 'aman@example.com',
      password: hashedPassword,
    });
    userId1 = user1._id.toString();
    userToken1 = jwt.sign({ id: userId1 }, process.env.JWT_SECRET);

    // 2. Test User 2 banaya (Race condition test karne ke liye)
    const user2 = await UserModel.create({
      name: 'Vikas Kumar',
      email: 'vikas@example.com',
      password: hashedPassword,
    });
    userId2 = user2._id.toString();
    userToken2 = jwt.sign({ id: userId2 }, process.env.JWT_SECRET);

    // 3. Test Barber banaya
    const barber = await BarberModel.create({
      name: 'Master Barber John',
      email: 'john.barber@example.com',
      password: hashedPassword,
      image: 'barber1.png',
      experience: '5 Years',
      about: 'Expert in fade cuts and beard styling',
      available: true,
      fees: 500,
      address: { line1: 'Street 10', line2: 'City Center' },
      date: Date.now(),
      slots_booked: {},
      services: [],
    });
    barberId = barber._id.toString();
  });

  // ==========================================
  // 1. Single Booking Flow (Cash Path)
  // ==========================================
  it('User successfully slot book kar sakta hai aur Barber ke slots_booked me update hona chahiye', async () => {
    const slotDate = '2026_10_05';
    const slotTime = '10:00 AM';

    // Hindi Comment: User 1 slot booking request bhej raha hai
    const res = await request(app)
      .post('/api/user/book-slot')
      .set('token', userToken1)
      .send({
        userId: userId1,
        barberId,
        slotDate,
        slotTime,
        paymentMethod: 'Cash',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    // Database me booking document verify kiya
    const bookingInDb = await bookingModel.findOne({ barberId, slotDate, slotTime });
    expect(bookingInDb).not.toBeNull();
    expect(bookingInDb.userId.toString()).toBe(userId1);
    expect(bookingInDb.paymentMethod).toBe('Cash');

    // Barber document ke slots_booked map me time add hua ya nahi verify kiya
    const updatedBarber = await BarberModel.findById(barberId);
    expect(updatedBarber.slots_booked[slotDate]).toContain(slotTime);
  });

  // ==========================================
  // 2. Race Condition / Double-Booking Prevention
  // ==========================================
  it('Pehle se booked slot par dusre user ki booking reject honi chahiye (Race condition prevention)', async () => {
    const slotDate = '2026_10_05';
    const slotTime = '11:00 AM';

    // Step 1: User 1 ne pehle slot book kiya
    const resUser1 = await request(app)
      .post('/api/user/book-slot')
      .set('token', userToken1)
      .send({
        userId: userId1,
        barberId,
        slotDate,
        slotTime,
        paymentMethod: 'Cash',
      });

    expect(resUser1.body.success).toBe(true);

    // Step 2: User 2 ne usi same date aur same time ka slot book karne ki koshish ki
    // Hindi Comment: MongoDB atomic update findOneAndUpdate query check karegi aur reject karegi
    const resUser2 = await request(app)
      .post('/api/user/book-slot')
      .set('token', userToken2)
      .send({
        userId: userId2,
        barberId,
        slotDate,
        slotTime,
        paymentMethod: 'Cash',
      });

    expect(resUser2.statusCode).toBe(200);
    expect(resUser2.body.success).toBe(false);
    expect(resUser2.body.message).toMatch(/already booked|not available/i);

    // Database me verify kiya ki sirf 1 hi booking document bana hai, duplicate nahi
    const totalBookings = await bookingModel.countDocuments({ barberId, slotDate, slotTime });
    expect(totalBookings).toBe(1);
  });

  // ==========================================
  // 3. Booking Cancellation & Slot Release
  // ==========================================
  it('Booking cancel hone par slot barber ke slots_booked se release hona chahiye', async () => {
    const slotDate = '2026_10_05';
    const slotTime = '02:00 PM';

    // Step 1: Slot book kiya
    const bookRes = await request(app)
      .post('/api/user/book-slot')
      .set('token', userToken1)
      .send({
        userId: userId1,
        barberId,
        slotDate,
        slotTime,
        paymentMethod: 'Cash',
      });
    expect(bookRes.body.success).toBe(true);

    const booking = await bookingModel.findOne({ barberId, slotDate, slotTime });
    const bookingId = booking._id.toString();

    // Step 2: Booking cancel request bheji
    // Hindi Comment: Cancel endpoint slot ko $pull operator se barber document se release karta hai
    const cancelRes = await request(app)
      .post('/api/user/cancel-booking')
      .set('token', userToken1)
      .send({ bookingId });

    expect(cancelRes.statusCode).toBe(200);
    expect(cancelRes.body.success).toBe(true);

    // Verify booking cancelled flag is true
    const updatedBooking = await bookingModel.findById(bookingId);
    expect(updatedBooking.cancelled).toBe(true);

    // Verify Barber slots_booked me ab yeh slot present nahi hai
    const updatedBarber = await BarberModel.findById(barberId);
    const slotsForDate = updatedBarber.slots_booked[slotDate] || [];
    expect(slotsForDate).not.toContain(slotTime);
  });
});
