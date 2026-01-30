import express from 'express';
import { getStorageMetrics } from '../server/storage/stats';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// This handles: GET http://localhost:5000/api/admin/storage/metrics
router.get('/metrics', async (req, res) => {
  console.log("📥 Storage metrics requested"); // Check if this shows in terminal
  res.json([{ animeId: "1", title: "Test", episodeCount: 0, totalSize: "0", monthlyCost: "0" }]);
});

export default router;