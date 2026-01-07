import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: String,
  userAvatar: String,
  animeTitle: String, // e.g., "One Piece"
  animeTag: String,   // e.g., "OP"
  location: String,   // e.g., "East Blue"
  content: { type: String, required: true },
  votes: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema);