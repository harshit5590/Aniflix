import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Ensure the word 'export' is right here!
export const protect = async (req: any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};