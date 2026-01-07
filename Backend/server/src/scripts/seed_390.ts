import mongoose from 'mongoose';
import Anime from '../models/Anime';
import data from './anime_data.json'; 
import dotenv from 'dotenv';

dotenv.config();

// server/src/scripts/seed_390.ts
async function seed() {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("🧹 Wiping database to prevent duplicates...");
    await Anime.deleteMany({}); // THIS IS CRITICAL

    // Ensure your data.json has keys: title, rating, ageRating, type, episodesCount
    console.log(`🚀 Inserting ${data.length} unique anime...`);
    await Anime.insertMany(data);
    
    console.log("✅ 390 Anime Uploaded Successfully!");
    process.exit();
}
seed();