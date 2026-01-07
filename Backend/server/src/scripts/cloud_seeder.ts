import mongoose from 'mongoose';
import axios from 'axios';
import Anime from '../models/Anime';
import dotenv from 'dotenv';

dotenv.config();

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function forceCloudEnrichment() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/Aniflix");
        console.log("Connected to MongoDB. Starting Force Update...");

        const allAnimes = await Anime.find();
        
        for (let i = 0; i < allAnimes.length; i++) {
            const anime = allAnimes[i];
            
            // CHECK: Only update if it's a placeholder link
            const isPlaceholder = !anime.poster || anime.poster.includes('placeholder.com');

            if (isPlaceholder) {
                try {
                    console.log(`[${i+1}/${allAnimes.length}] Updating: ${anime.title}`);
                    
                    const response = await axios.get(`https://api.jikan.moe/v4/anime`, {
                        params: { q: anime.title, limit: 1 }
                    });

                    const result = response.data.data[0];

                    if (result) {
                        // Get real images from Jikan
                        anime.poster = result.images.webp.large_image_url || result.images.jpg.large_image_url;
                        anime.banner = result.images.webp.large_image_url; // Fallback banner
                        anime.description = result.synopsis || anime.description;
                        
                        await anime.save();
                        console.log(`✅ SUCCESS: ${anime.title}`);
                    } else {
                        console.log(`❌ NOT FOUND on Jikan: ${anime.title}`);
                    }

                    // WAIT 2 SECONDS (Important: Jikan will block you if you go faster)
                    await delay(2000);

                } catch (err: any) {
                    if (err.response?.status === 429) {
                        console.log("⚠️ Rate limited! Sleeping for 15 seconds...");
                        await delay(15000);
                        i--; // Retry this anime
                    } else {
                        console.error(`Error for ${anime.title}:`, err.message);
                    }
                }
            } else {
                console.log(`⏩ Skipping (Already updated): ${anime.title}`);
            }
        }

        console.log("🎉 All placeholders replaced with real anime cloud links!");
        process.exit();
    } catch (error) {
        console.error("Connection Error:", error);
    }
}

forceCloudEnrichment();