import express, { Response } from 'express';
import prisma from '../lib/prisma';
import { protect, isAdmin } from '../middleware/authMiddleware';
import { upload } from '../middleware/upload'; // Multer config we made earlier
import fs from 'fs';
import path from 'path';

const router = express.Router();

/** 
 * ==========================================
 * 1. USER SELF-SERVICE ROUTES (Authenticated)
 * ==========================================
 */

// GET current logged-in user profile
router.get('/profile', protect, async (req: any, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, fullName: true, email: true, role: true, profilePic: true, age: true, dob: true, createdAt: true }
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE current user profile info
router.put('/update', protect, async (req: any, res: Response) => {
  try {
    const { fullName, age, dob } = req.body;
    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: { fullName, age: Number(age), dob }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
});

// UPLOAD / CHANGE Profile Picture
router.post('/upload-avatar', protect, upload.single('avatar'), async (req: any, res: any) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const relativePath = `/public/uploads/avatars/${req.file.filename}`;
    
    // Update DB
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { profilePic: relativePath }
    });

    res.json({ message: "Avatar updated!", profilePic: relativePath });
  } catch (error) {
    res.status(500).json({ message: "Upload failed" });
  }
});

// REMOVE Profile Picture
router.delete('/remove-avatar', protect, async (req: any, res: any) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user || !user.profilePic) return res.status(400).json({ message: "No picture found" });

    // Delete physical file
    const filePath = path.join(__dirname, '../..', user.profilePic);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    // Update DB
    await prisma.user.update({
      where: { id: req.user.id },
      data: { profilePic: "" }
    });

    res.json({ message: "Avatar removed" });
  } catch (error) {
    res.status(500).json({ message: "Removal failed" });
  }
});


/** 
 * ==========================================
 * 2. ADMIN MANAGEMENT ROUTES (Admin Only)
 * ==========================================
 */

// GET ALL USERS (For Admin Table)
router.get('/admin/all', protect, isAdmin, async (req: any, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user list" });
  }
});

// CHANGE USER ROLE (Promote/Demote)
router.put('/admin/role/:id', protect, isAdmin, async (req: any, res: Response) => {
  try {
    const { role } = req.body;
    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { role }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Role update failed" });
  }
});


// DELETE ANY USER
router.delete('/admin/:id', protect, isAdmin, async (req: any, res: Response) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: "User deleted by admin" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;