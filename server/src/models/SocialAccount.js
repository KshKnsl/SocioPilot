import mongoose from 'mongoose';

const SocialAccountSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  platform: { type: String, enum: ['twitter'], required: true },
  credentials: { type: String, required: false },
  username: String,
  status: { type: String, enum: ['connected', 'revoked', 'pending', 'disconnected'], default: 'connected' },
  state: String
}, { timestamps: true });

export default mongoose.model('SocialAccount', SocialAccountSchema);
