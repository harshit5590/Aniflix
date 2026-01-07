import express from 'express';
import Post from '../models/post';
import { protect } from '../middleware/authMiddleware'; // MUST HAVE CURLY BRACES {}

const router = express.Router();

// Route for getting posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
});

// Route for creating posts (Line 12 - where it was crashing)
router.post('/', protect, async (req: any, res: any) => {
  try {
    const { title, description, category, userName, userAvatar } = req.body;
    
    const newPost = new Post({
      userId: req.user.id,
      userName,
      userAvatar,
      category,
      title,
      description
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: "Post creation failed" });
  }
});

export default router;