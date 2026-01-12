import mongoose from 'mongoose';

const SocialAccountSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  platform: { type: String, enum: ['twitter'], required: true },
  encryptedCredentials: { type: String, required: true }, 
  username: String,
  status: { type: String, enum: ['connected', 'revoked', 'pending'], default: 'connected' },
  profileImage: String
}, { timestamps: true });

export default mongoose.model('SocialAccount', SocialAccountSchema);
