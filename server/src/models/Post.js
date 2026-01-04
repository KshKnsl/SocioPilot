import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
  platform: String,
  content: String,
  imageFilename: String,
  topic: String,
  scheduledFor: { type: Date, required: false },
  status: { type: String, enum: ['draft', 'scheduled', 'posted'], default: 'draft' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Post', PostSchema);
