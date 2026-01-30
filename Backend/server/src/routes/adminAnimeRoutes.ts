import express from 'express';
import prisma from '../lib/prisma';
import { protect, isAdmin } from '../middleware/authMiddleware';

const router = express.Router();

// 1. ADD NEW ANIME
router.post('/', protect, isAdmin, async (req, res) => {
  try {
    const newAnime = await prisma.anime.create({ data: req.body });
    res.status(201).json(newAnime);
  } catch (error) {
    res.status(500).json({ message: "Error adding anime" });
  }
});

// 2. UPDATE ANIME
router.put('/:id', protect, isAdmin, async (req: any, res: any) => {
  const { title, rating, type, episodesCount, description, genres } = req.body;
  try {
    const updated = await prisma.anime.update({
      where: { id: req.params.id },
      data: { title, rating, type, episodesCount, description, genres }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
});
// GET episodes for a specific anime
router.get('/:id/episodes', protect, isAdmin, async (req: any, res: any) => {
  try {
    const episodes = await prisma.episode.findMany({
      where: { animeId: req.params.id },
      orderBy: { episodeNumber: 'asc' }
    });
    res.json(episodes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch episodes" });
  }
});

// 1. Create a new episode for an anime
router.post('/:id/episodes', protect, isAdmin, async (req: any, res: any) => {
  const { episodeNumber, title } = req.body;
  const animeId = req.params.id;

  try {
    const newEpisode = await prisma.episode.create({
      data: {
        episodeNumber: parseInt(episodeNumber),
        title: title || `Episode ${episodeNumber}`,
        animeId: animeId
      }
    });
    res.status(201).json(newEpisode);
  } catch (error) {
    res.status(500).json({ message: "Failed to create episode. It might already exist." });
  }
});
// GET all episodes for a specific anime
router.get('/:id/episodes', protect, isAdmin, async (req: any, res: any) => {
  try {
    const { id } = req.params;

    // Use Prisma to find episodes belonging to this animeId
    const episodes = await prisma.episode.findMany({
      where: { animeId: id },
      orderBy: { episodeNumber: 'asc' }
    });

    res.json(episodes || []); // Always return an array, even if empty
  } catch (error) {
    console.error("Episode Fetch Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// 3. DELETE ANIME
router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    await prisma.anime.delete({ where: { id: req.params.id } });
    res.json({ message: "Anime deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;