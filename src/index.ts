import dotenv from 'dotenv';
import  express from 'express';
import mongoose from 'mongoose';

import cors from 'cors';

import authRoutes from './routes/auth.routes';
import feedbackRoutes from './routes/feedback.routes';

dotenv.config();
const app = express();
// Allow requests from your frontend
app.use(cors({
  origin: 'http://localhost:3000', // your frontend URL
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true, // if you use cookies/session
}));


app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log('DB Connected'));

app.use('/api/feedback', feedbackRoutes);
app.use('/api/auth', authRoutes);

app.listen(4000, () => console.log('Server running'));