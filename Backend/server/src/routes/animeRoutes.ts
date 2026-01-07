import express, { Request, Response } from 'express';
import Anime from '../models/Anime'; // Line 2: Ensure this path is correct

const router = express.Router();

// 1. Suggestions Route (MUST be above /:id)
router.get('/suggestions', async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q || q.toString().length < 2) return res.json([]);

    const suggestions = await Anime.find(
      { title: { $regex: q.toString(), $options: 'i' } },
      { title: 1, poster: 1, _id: 1 }
    ).limit(8);

    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching suggestions" });
  }
});

// 2. Get All Anime
router.get('/', async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    let query = {};
    if (q) {
      query = { title: { $regex: q.toString(), $options: 'i' } };
    }
    const animes = await Anime.find(query);
    res.json(animes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching all anime" });
  }
});

// 3. Get Single Anime by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const anime = await Anime.findById(req.params.id);
    if (!anime) return res.status(404).json({ message: "Anime not found" });
    res.json(anime);
  } catch (err) {
    res.status(500).json({ message: "Invalid ID or Server Error" });
  }
});

export default router;