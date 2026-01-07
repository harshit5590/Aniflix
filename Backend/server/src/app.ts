import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import animeRoutes from './routes/animeRoutes';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';

dotenv.config();
const app = express();

// 1. MUST BE FIRST: CORS
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

// 2. Static Folder for Images
app.use('/public', express.static(path.join(__dirname, '../public')));

// 3. API Routes
app.use('/api/anime', animeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes); 


// 4. DB Connection - Use 127.0.0.1 for Windows stability
const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/Aniflix";
mongoose.connect(MONGO_URI).then(() => {
  console.log("✅ MongoDB Connected");
  app.listen(5000, "0.0.0.0", () => console.log("🚀 Backend: http://127.0.0.1:5000"));
});