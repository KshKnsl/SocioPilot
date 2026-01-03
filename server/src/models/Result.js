import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  platform: String,
  content: String,
  imageFilename: String
});

const ResultSchema = new mongoose.Schema({
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
  topics: [String],
  ideas: [String],
  posts: [PostSchema],
  imagePrompts: [String],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Result', ResultSchema);
