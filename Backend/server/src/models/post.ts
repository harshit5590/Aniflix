import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: String,
  userAvatar: String,
  category: { type: String, enum: ['Suggestion', 'Recommendation', 'Thought'], default: 'Thought' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  commentCount: { type: Number, default: 0 },
  imageUrl: String,
}, { timestamps: true });

export default mongoose.models.Post || mongoose.model('Post', PostSchema);