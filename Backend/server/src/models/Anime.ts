import mongoose from 'mongoose';

const AnimeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  rating: { type: String, default: "N/A" },
  ageRating: { type: String, default: "N/A" },
  type: { type: String, default: "TV" },
  episodesCount: { type: String, default: "N/A" },
  description: { type: String, default: "" },
  poster: { type: String, default: "" },
  banner: { type: String, default: "" },
  genres: { type: [String], default: [] },
});

export default mongoose.models.Anime || mongoose.model('Anime', AnimeSchema);