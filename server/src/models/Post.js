import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  platform: String,
  content: String,
  imageFilename: String,
  topic: String,
  scheduledFor: { type: Date, required: false },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'posted', 'failed'],
    default: 'draft'
  },
  platformPostId: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Post', PostSchema);
