import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv/config';
import http from 'http'; // HTTP server use kiya Socket.io attach karne ke liye
import { Server } from 'socket.io'; // Socket.io server class import kiya
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import barberRouter from './routes/barberRoute.js';
import userRouter from './routes/userRoute.js';
import messageModel from './models/messageModel.js'; // Messages persist karne ke liye

const app = express();
const port = process.env.PORT || 4000;

// HTTP server ko express app wrap karke banaya hai
const server = http.createServer(app);

connectDB();
connectCloudinary();

// CORS configuration for both local and production URLs
const allowedOrigins = [
  'http://localhost:5173',      // Client local
  'http://localhost:5174',      // Admin local
  'https://barber-q-lemon.vercel.app',  // Client production
  'https://barberadmin.vercel.app',     // Admin production
  'https://barberq.anuragkr.me' // domain name purchased 
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'token', 'aToken', 'bToken'],
}));

app.use(express.json());

// Socket.io instance create kiya CORS allowed properties ke sath
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
  }
});

// Sockets instance ko har controller router controllers me directly use karne ke liye request object me pass kiya
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Socket connectivity event logic
io.on('connection', (socket) => {
  console.log('A user connected via socket:', socket.id);

  // Client ya barber dynamic room join karta hai using Barber ID
  socket.on('join_barber_room', (barberId) => {
    socket.join(`barber_${barberId}`);
    console.log(`Socket ID: ${socket.id} joined barber_${barberId} room`);
  });

  // Client ya barber chat room join karte hai (linked via bookingId)
  socket.on('join_chat_room', (bookingId) => {
    socket.join(`chat_${bookingId}`);
    console.log(`Socket ID: ${socket.id} joined chat_${bookingId} room`);
  });

  // Realtime in-app direct messaging handler
  socket.on('send_message', async (data) => {
    try {
      const { senderId, receiverId, bookingId, text } = data;
      
      const newMsg = new messageModel({
        senderId,
        receiverId,
        bookingId,
        text
      });
      await newMsg.save();

      // Broadcast the message back to client and barber room
      io.to(`chat_${bookingId}`).emit('receive_message', newMsg);
    } catch (err) {
      console.log('Socket message save failed:', err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// api endpoints
app.use('/api/admin', adminRouter);
app.use('/api/barber', barberRouter);
app.use('/api/user', userRouter);

app.get('/', (req, res) => {
  res.send('Api is Working Fine!');
});

// Important: Express app.listen key jagah server.listen call kiya socket listener active karne ke liye
server.listen(port, () => {
  console.log('Server is running on PORT:', port);
});
