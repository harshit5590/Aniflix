import express from 'express';
import { setSystemFlag } from '../server/system/controls';
import { protect } from '../middleware/authMiddleware'; // Assuming you have an isAdmin check

const router = express.Router();

router.post('/toggle', protect, async (req: any, res: any) => {
  const { key, value } = req.body; // e.g. { key: "TRANSCODING_ENABLED", value: false }
  
  try {
    await setSystemFlag(key, value);
    res.json({ message: `System flag ${key} set to ${value}` });
  } catch (err) {
    res.status(500).json({ error: "Failed to update system state" });
  }
});

export default router;