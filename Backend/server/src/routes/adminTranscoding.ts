import express from 'express';
import prisma from '../lib/prisma'; 
import { transcodeQueue } from '../server/transcoding/queue';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/jobs', protect, async (req: any, res: any) => {
  try {
    // 1. SAFE CHECK: Make sure prisma exists
    if (!prisma) {
      return res.status(500).json({ message: "Prisma client not initialized" });
    }

    // 2. The most important fix: Naming
    // Prisma requires lowercase 't' and uppercase 'J'
    const jobs = await (prisma as any).transcodingJob.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        episodeSource: {
          include: {
            episode: {
              include: { anime: true }
            }
          }
        }
      }
    });

  res.json(jobs || []);
  } catch (error) {
    console.error("Transcoding Fetch Error:", error);
    // Return empty array instead of crashing the site
    res.json([]); 
  }
});

export default router;