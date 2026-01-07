import express from 'express';
import User from '../models/User';
import { protect } from '../middleware/authMiddleware';
import { upload } from '../middleware/upload';
import fs from 'fs';
import path from 'path'
const router = express.Router();

// 1. GET User Profile Data
router.get('/profile', protect, async (req: any, res) => {
    try {
        // Find user by ID but don't send the password back
        const user = await User.findById(req.user.id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/remove-avatar', protect, async (req: any, res: any) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.profilePic) {
      return res.status(400).json({ message: "No profile picture to remove" });
    }

    // 1. Delete physical file from the folder
    const filePath = path.join(__dirname, '../..', user.profilePic);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // 2. Clear path in Database
    user.profilePic = "";
    await user.save();

    res.json({ message: "Profile picture removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error during removal" });
  }
});

// Inside the upload route
router.post('/upload-avatar', protect, upload.single('avatar'), async (req: any, res: any) => {
  if (!req.file) return res.status(400).send("No file uploaded");

  // SAVE THIS FORMAT: /public/uploads/avatars/filename.png
  // Do NOT save the absolute Windows path (D:\...)
  const relativePath = `/public/uploads/avatars/${req.file.filename}`;

  const user = await User.findById(req.user.id);
  user.profilePic = relativePath;
  await user.save();

  res.json({ profilePic: relativePath });
});



// 2. UPDATE User Profile (Name, Age, DOB, ProfilePic)
router.put('/update', protect, async (req: any, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.fullName = req.body.fullName || user.fullName;
            user.age = req.body.age || user.age;
            user.dob = req.body.dob || user.dob;
            user.profilePic = req.body.profilePic || user.profilePic;

            const updatedUser = await user.save();
            res.json({
                id: updatedUser._id,
                fullName: updatedUser.fullName,
                email: updatedUser.email,
                profilePic: updatedUser.profilePic,
                age: updatedUser.age,
                dob: updatedUser.dob
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile' });
    }
});

export default router;