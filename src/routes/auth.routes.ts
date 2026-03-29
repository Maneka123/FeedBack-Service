import { Router, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { adminAuth } from '../middleware/auth.middleware';

const router = Router();

// Admin login
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is not defined');

    const token = jwt.sign({ email }, secret, { expiresIn: '1h' });
    return res.json({ success: true, token });
  }

  return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// Protected test route
router.get('/test', adminAuth, (_req: Request, res: Response) => {
  return res.json({ success: true, message: 'Admin access granted' });
});

export default router;