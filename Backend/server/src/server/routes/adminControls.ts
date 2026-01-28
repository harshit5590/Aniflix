import express from 'express';
import { setSystemFlag, getSystemFlag, SystemControlKey } from '../system/controls';
import { protect, isAdmin } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/status', protect, isAdmin, async (req, res) => {
  const flags: SystemControlKey[] = [
    'GLOBAL_TRANSCODE_PAUSE', 
    'FORCE_MP4_ONLY', 
    'MAINTENANCE_MODE', 
    'DISABLE_TERABOX', 
    'DISABLE_GDRIVE'
  ];
  
  const status = await Promise.all(flags.map(async (f) => ({
    key: f,
    enabled: await getSystemFlag(f)
  })));
  
  res.json(status);
});

router.post('/toggle', protect, isAdmin, async (req, res) => {
  const { key, value } = req.body;
  await setSystemFlag(key as SystemControlKey, value);
  res.json({ message: `System flag ${key} updated to ${value}` });
});

export default router;