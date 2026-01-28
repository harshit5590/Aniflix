import express from 'express';
import prisma from '../../lib/prisma';  // 1. Ensure this path points to your Prisma singleton

const router = express.Router();


router.get('/jobs', async (req, res) => {
  try {
    // 2. CHECK THE SPELLING HERE: 'transcodingJob' 
    // (If your schema says 'TranscodingJob', use 'transcodingJob' here)
    const jobs = await prisma.transcodingJob.findMany({
      orderBy: { createdAt: 'desc' },
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
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).send("DB Error");
  }
});