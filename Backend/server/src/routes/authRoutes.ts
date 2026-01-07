import express from 'express';
import { register, login } from '../controllers/authController';
import { protect } from '../middleware/auth';
import User from '../models/User';


const router = express.Router();
router.get('/profile', protect, async (req: any, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

router.put('/update', protect, async (req: any, res) => {
  const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });
  res.json(user);
});

// Public Routes
router.post('/register', register);
router.post('/login', login);

export default router;