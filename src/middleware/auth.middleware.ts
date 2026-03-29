import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

interface JwtPayload {
  email: string;
}

export const adminAuth = (req: Request, res: Response, next: NextFunction): Response | void => {
  const authHeader = req.headers.authorization;

  // 1️⃣ Check that Authorization header exists
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  // 2️⃣ Extract token
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  // 3️⃣ Check that JWT_SECRET exists
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ success: false, message: 'JWT_SECRET is not defined' });
  }

  try {
    // 4️⃣ Verify token safely
    const decoded = jwt.verify(token, secret) as unknown;

    // 5️⃣ Ensure decoded is an object with email
    if (typeof decoded !== 'object' || decoded === null || !('email' in decoded)) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    const payload = decoded as JwtPayload;

    // 6️⃣ Check hardcoded admin email
    if (payload.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ success: false, message: 'Forbidden: Admins only' });
    }

    // ✅ All checks passed, call next middleware
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};