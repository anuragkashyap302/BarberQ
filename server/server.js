import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import barberRouter from './routes/barberRoute.js';
import userRouter from './routes/userRoute.js';

const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();
app.use(cors());
app.use(express.json());

// api endpints
app.use('/api/admin', adminRouter);
app.use('/api/barber', barberRouter);
app.use('/api/user', userRouter);
// localhost:4000/api/admin/add-barber
app.get('/', (req, res) => {
  res.send('Api is Working Fine!');
});

app.listen(port, () => {
  console.log('Server is running on PORT:', port);
  
});
