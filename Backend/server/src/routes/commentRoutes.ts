import express from 'express';
import Comment from '../models/Comment';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// This handles GET http://localhost:5000/api/comments
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching comments" });
  }
});

// This handles POST http://localhost:5000/api/comments
// server/src/routes/commentRoutes.ts

router.post('/', protect, async (req: any, res: any) => {
  try {
    const { content, animeTitle, userName, userAvatar } = req.body;

    // 1. Create and save the new comment
    const newComment = new Comment({
      userId: req.user.id,
      userName,
      userAvatar,
      animeTitle,
      content,
      animeTag: animeTitle.substring(0, 2).toUpperCase(),
      location: "Global"
    });
    await newComment.save();

    // 2. CHECK TOTAL COUNT: If more than 3, delete the oldest one
    const count = await Comment.countDocuments();
    
    if (count > 3) {
      // Find the oldest comment (sort by createdAt ascending) and delete it
      await Comment.findOneAndDelete({}, { sort: { createdAt: 1 } });
      console.log("🧹 Oldest comment deleted to maintain 3-comment limit.");
    }

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: "Failed to post comment" });
  }
});

export default router;