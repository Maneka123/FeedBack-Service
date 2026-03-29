import  express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/auth.routes';
import feedbackRoutes from './routes/feedback.routes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log('DB Connected'));

app.use('/api/feedback', feedbackRoutes);
app.use('/api/auth', authRoutes);

app.listen(4000, () => console.log('Server running'));