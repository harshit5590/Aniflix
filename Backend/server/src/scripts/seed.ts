import mongoose from 'mongoose';
import Anime from '../models/Anime';
const data = require('./data.json'); // Using require for easier JSON handling
import dotenv from 'dotenv';
import path from 'path';

// This tells dotenv exactly where the .env file is relative to this script
dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log("Cleaning database...");
  await Anime.deleteMany({}); // THIS CLEARS OLD DATA TO PREVENT DUPLICATES
  await Anime.insertMany(data);
  console.log("390 Clean Anime Uploaded!");
  process.exit();
};


seedDB();