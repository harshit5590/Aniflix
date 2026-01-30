import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// 1. Protect Middleware (Ensures user is logged in)
export const protect = async (req: any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'aniflix_ultra_secret_key_99');
    req.user = { id: decoded.id, role: decoded.role }; // Add role here
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalid" });
  }
};

// 2. IsAdmin Middleware (Ensures user is an Admin)
export const isAdmin = (req: any, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: "Access denied: Admins only" });
  }
};