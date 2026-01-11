import express from 'express';
import Post from '../models/Post.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

function updatePostScheduling(post, scheduledFor) {
  const isClear = scheduledFor === null || scheduledFor === '';
  post.scheduledFor = isClear ? null : new Date(scheduledFor);
  post.status = isClear
    ? (post.status === 'scheduled' ? 'draft' : post.status)
    : (post.status !== 'posted' ? 'scheduled' : post.status);
}

router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id }).sort({ createdAt: -1 });
    const mapped = posts.map(p => ({
      postId: p._id,
      content: p.content,
      platform: p.platform,
      imageFilename: p.imageFilename,
      createdAt: p.createdAt,
      topic: p.topic || null,
      scheduledFor: p.scheduledFor || null,
      status: p.status || 'draft'
    }));

    res.json(mapped);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.patch('/:postId', auth, async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, scheduledFor } = req.body;
    const post = await Post.findById(postId);
    post.content = content;

    if (scheduledFor !== undefined) {
      updatePostScheduling(post, scheduledFor);
    }
    await post.save();

    res.json({ postId: post._id, content: post.content, scheduledFor: post.scheduledFor, status: post.status });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
