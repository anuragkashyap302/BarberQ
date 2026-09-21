import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv/config';
import http from 'http'; // HTTP server use kiya Socket.io attach karne ke liye
import { Server } from 'socket.io'; // Socket.io server class import kiya
import helmet from 'helmet'; // HTTP Security Headers ke liye Helmet import kiya
import morgan from 'morgan'; // HTTP request logging ke liye Morgan import kiya
import logger from './config/logger.js'; // Winston structured logger import kiya
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import barberRouter from './routes/barberRoute.js';
import userRouter from './routes/userRoute.js';
import messageModel from './models/messageModel.js'; // Messages persist karne ke liye
import { generalLimiter } from './middlewares/rateLimiter.js'; // Express Rate Limiter
import errorHandler from './middlewares/errorHandler.js'; // Centralized Error Handler

const app = express();
const port = process.env.PORT || 4000;

// HTTP server ko express app wrap karke banaya hai
const server = http.createServer(app);

// Hindi Comment: Non-test environment me hi database aur Cloudinary initialize karenge
if (process.env.NODE_ENV !== 'test') {
  connectDB();
  connectCloudinary();
}

// Hindi Comment: Helmet security headers configure kiya (XSS protection, MIME sniffing prevention, frameguard)
// crossOriginResourcePolicy: false rakha taaki Cloudinary aur external assets smoothly render hon
app.use(helmet({
  crossOriginResourcePolicy: false,
  crossOriginEmbedderPolicy: false,
}));

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

// Hindi Comment: Morgan HTTP logger ko Winston ke stream adapter ke sath connect kiya
app.use(morgan(':method :url :status :res[content-length] - :response-time ms', { stream: logger.stream }));

app.use(express.json());

// Hindi Comment: Sabhi API routes pe standard rate limiter apply kiya DoS attack prevention ke liye
app.use('/api', generalLimiter);

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
  logger.info(`[Socket] User connected with socket ID: ${socket.id}`);

  // Client ya barber dynamic room join karta hai using Barber ID
  socket.on('join_barber_room', (barberId) => {
    socket.join(`barber_${barberId}`);
    logger.info(`[Socket] Socket ID: ${socket.id} joined barber_${barberId} room`);
  });

  // Client ya barber chat room join karte hai (linked via bookingId)
  socket.on('join_chat_room', (bookingId) => {
    socket.join(`chat_${bookingId}`);
    logger.info(`[Socket] Socket ID: ${socket.id} joined chat_${bookingId} room`);
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
      logger.error(`[Socket] Message save failed: ${err.message}`);
    }
  });

  socket.on('disconnect', () => {
    logger.info(`[Socket] User disconnected: ${socket.id}`);
  });
});

// api endpoints
app.use('/api/admin', adminRouter);
app.use('/api/barber', barberRouter);
app.use('/api/user', userRouter);

app.get('/', (req, res) => {
  res.send('Api is Working Fine!');
});

// Hindi Comment: Centralized error handling middleware ko sabhi routes ke baad mount kiya
app.use(errorHandler);

// Hindi Comment: Non-test mode me hi server port listen karega taaki Jest tests ke sath port conflict na ho
if (process.env.NODE_ENV !== 'test') {
  server.listen(port, () => {
    logger.info(`Server is running successfully on PORT: ${port}`);
  });
}

export { app, server };
export default app;
