import { Router, Request, Response } from 'express';
import Feedback from '../models/feedback.model';
import { adminAuth } from '../middleware/auth.middleware';

const router = Router();

// 1️⃣ Anyone can submit feedback
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, description, category, submitterName, submitterEmail } = req.body;

    if (!title || !description || description.length < 20) {
      return res.status(400).json({ success: false, message: 'Invalid input' });
    }

    const feedback = await Feedback.create({
      title,
      description,
      category,
      submitterName,
      submitterEmail,
      status: 'New',
    });

    return res.status(201).json({ success: true, data: feedback, message: 'Feedback submitted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 2️⃣ Admin: List all feedback + filters
router.get('/', adminAuth, async (req: Request, res: Response) => {
  try {
    const { category, status } = req.query;
    const filter: any = {};

    if (category) filter.category = category;
    if (status) filter.status = status;

    const feedbacks = await Feedback.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, data: feedbacks });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 3️⃣ Admin: Get single feedback
router.get('/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ success: false, message: 'Feedback not found' });

    return res.json({ success: true, data: feedback });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 4️⃣ Admin: Update status
router.patch('/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!['New', 'In Review', 'Resolved'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const feedback = await Feedback.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!feedback) return res.status(404).json({ success: false, message: 'Feedback not found' });

    return res.json({ success: true, data: feedback });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 5️⃣ Admin: Delete feedback
router.delete('/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) return res.status(404).json({ success: false, message: 'Feedback not found' });

    return res.json({ success: true, message: 'Feedback deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;