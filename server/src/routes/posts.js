import express from 'express';
import Post from '../models/Post.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (e) {
    next(e);
  }
});

router.patch('/:postId', auth, async (req, res) => {
  try {
    const { postId } = req.params;

    const updates = { ...req.body };
    if ('scheduledFor' in updates) {
      updates.scheduledFor = updates.scheduledFor ? new Date(updates.scheduledFor) : null;
    }
    const updated = await Post.findByIdAndUpdate(postId, updates, { new: true });
    res.json(updated);
  } catch (e) {
    next(e);
  }
});

export default router;
