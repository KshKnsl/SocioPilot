import express from 'express';
import Post from '../models/Post.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const { brandId } = req.query;
    const q = {};
    if (brandId) q['brand'] = brandId;

    const posts = await Post.find(q).populate('brand').sort({ createdAt: -1 });
    const mapped = posts.map(p => ({
      postId: p._id,
      content: p.content,
      platform: p.platform,
      imageFilename: p.imageFilename,
      brand: p.brand ? { id: p.brand._id, title: p.brand.title } : null,
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

    const post = await Post.findById(postId).populate('brand');
    if (!post || !post.brand || post.brand.user.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (content !== undefined) {
      if (typeof content !== 'string') return res.status(400).json({ error: 'Content must be a string' });
      post.content = content;
    }

    if (scheduledFor !== undefined) {
      if (scheduledFor === null || scheduledFor === '') {
        post.scheduledFor = null;
        if (post.status === 'scheduled') post.status = 'draft';
      } else {
        const d = new Date(scheduledFor);
        if (isNaN(d.getTime())) return res.status(400).json({ error: 'scheduledFor must be a valid date' });
        post.scheduledFor = d;
        if (post.status !== 'posted') post.status = 'scheduled';
      }
    }

    await post.save();

    res.json({ postId: post._id, content: post.content, scheduledFor: post.scheduledFor, status: post.status });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
