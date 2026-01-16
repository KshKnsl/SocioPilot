const JobSchema = new mongoose.Schema({
  type: { type: String, enum: ['post_publish', 'comment_reply'], required: true },
  refId: { type: mongoose.Schema.Types.ObjectId, required: true },
  runAt: { type: Date, required: true },
  status: {
    type: String,
    enum: ['pending', 'running', 'completed', 'failed'],
    default: 'pending'
  },
  attempts: { type: Number, default: 0 },
  error: String
}, { timestamps: true });
