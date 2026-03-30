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

const app = express();

// Allow requests from your frontend
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET','POST','PUT','DELETE','PATCH'],
  credentials: true,
}));

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log('DB Connected'))
  .catch(err => console.error('DB Connection error:', err));

// Feedback routes
app.use('/api/feedback', feedbackRoutes);       // POST / create feedback
app.use('/api/feedback', feedbackListRoutes);   // GET /list (admin)
app.use('/api/feedback', feedbackDetailRoutes); // GET /:id (admin)
app.use('/api/feedback', feedbackStatusRoutes); // PATCH /:id/status (admin)
app.use('/api/feedback', feedbackDeleteRoutes); // DELETE /:id (admin)
app.use('/api/feedback', feedbackFilterRoutes); // GET /filter
app.use('/api/feedback/list/summary', feedbackListSummaryRoutes);

// Auth routes
app.use('/api/auth', authRoutes);

app.listen(4000, () => console.log('Server running on port 4000'));