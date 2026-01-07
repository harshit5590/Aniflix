import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// 1. REGISTER LOGIC
export const register = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, age, dob } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already registered. Please login." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      age,
      dob,
      profilePic: "" // Default empty
    });

    await newUser.save();
    res.status(201).json({ message: "Account created successfully! You can now login." });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong during registration." });
  }
};

// 2. LOGIN LOGIC
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // RULE: If user is NOT in database, reject the request (404)
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Account not found. Please sign up first." });
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid password." });
    }

    // Create Token (JWT)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '7d' }
    );

    res.status(200).json({ 
      token, 
      user: { 
        id: user._id, 
        fullName: user.fullName, 
        email: user.email, 
        profilePic: user.profilePic,
        role: user.role 
      } 
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong during login." });
  }
};