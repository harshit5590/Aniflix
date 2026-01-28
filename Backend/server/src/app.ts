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
import streamMp4 from './server/routes/streamMp4';
import episodeStream from './server/routes/episodeStream';
import './server/transcoding/worker'; // Start the worker process
import { streamLimiter, authLimiter } from './server/middleware/rateLimiter';
import { accessLogger } from './server/observability/securityAudit';
import adminTranscoding from './routes/adminTranscoding';
import './server/transcoding/worker'; 
import { logger } from './server/observability/logging';


dotenv.config();
const app = express();

// 1. MUST BE FIRST: CORS
// app.use(cors());
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"], // Allow your frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


// 2. Static Folder for Images
app.use('/public', express.static(path.join(__dirname, '../public')));

// 3. API Routes

// 1. Apply global logging/security audit
app.use(accessLogger);

// 2. Protect Auth Routes
app.use('/api/auth', authLimiter);

// 3. Protect Streaming Endpoints
app.use('/api/stream/mp4', streamLimiter);
app.use('/api/stream/secure', streamLimiter);
app.use('/api/anime', animeRoutes);
app.use('/api/admin/transcoding', adminTranscoding);
app.use('/api/stream/mp4', streamMp4);
app.use('/api/episode', episodeStream);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes); 
app.use((err: any, req: any, res: any, next: any) => {
  logger.error(`Critical System Error: ${err.message}`);
  res.status(500).json({ error: "Internal Server Error" });
});

// 4. DB Connection - Use 127.0.0.1 for Windows stability
// ... existing imports and app.use lines ...

const PORT = 5000;
const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/Aniflix";

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    // THIS LINE KEEPS THE SERVER RUNNING FOREVER
    app.listen(PORT, () => {
      console.log(`🚀 Server is active at http://127.0.0.1:${PORT}`);
    });
  })
  .catch((err) => console.error("❌ Connection Error:", err));