import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import authRoutes from './routes/auth.routes';
import feedbackRoutes from './routes/feedback.routes';
import feedbackListRoutes from './routes/feedback.list.routes';
import feedbackDetailRoutes from './routes/feedback.detail.routes';
import feedbackStatusRoutes from './routes/feedback.status.routes';
import feedbackDeleteRoutes from './routes/feedback.delete.routes';
import feedbackFilterRoutes from './routes/feedback.filter.routes';
import feedbackListSummaryRoutes from './routes/feedback.list.summary.routes';

dotenv.config();

export const app = express(); // export app for tests

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET','POST','PUT','DELETE','PATCH'],
  credentials: true,
}));

app.use(express.json());

// Only connect to DB if not already connected
const dbUri = process.env.NODE_ENV === 'test' ? process.env.MONGO_URI_TEST : process.env.MONGO_URI;
mongoose.connect(dbUri!)
  .then(() => console.log(`DB Connected (${process.env.NODE_ENV || 'development'})`))
  .catch(err => console.error('DB Connection error:', err));

// Routes
app.use('/api/feedback', feedbackRoutes);
app.use('/api/feedback', feedbackListRoutes);
app.use('/api/feedback', feedbackDetailRoutes);
app.use('/api/feedback', feedbackStatusRoutes);
app.use('/api/feedback', feedbackDeleteRoutes);
app.use('/api/feedback', feedbackFilterRoutes);
app.use('/api/feedback/list/summary', feedbackListSummaryRoutes);
app.use('/api/auth', authRoutes);

// Start server only if not testing
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 4000;
  app.listen(4000, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
}