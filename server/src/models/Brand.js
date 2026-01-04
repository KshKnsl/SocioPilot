import mongoose from 'mongoose';

const BrandSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  style: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

BrandSchema.index({ user: 1, title: 1 }, { unique: true });

export default mongoose.model('Brand', BrandSchema);
