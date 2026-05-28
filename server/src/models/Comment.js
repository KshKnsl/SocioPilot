import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  platformCommentId: String,
  author: String,
  text: String,
  intent: {
    type: String,
    enum: ['question', 'complaint', 'praise', 'spam', 'unknown']
  },
  replied: { type: Boolean, default: false },
  replyText: String
}, { timestamps: true });

export default mongoose.model('Comment', CommentSchema);
