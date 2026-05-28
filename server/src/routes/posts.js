import express from 'express';
import Post from '../models/Post.js';
import { auth } from '../middleware/auth.js';
import { validatePostPatchPayload } from '../middleware/validate.js';
import { getQueueStats, removeScheduledPostJob, schedulePostPublish } from '../queues/index.js';

const router = express.Router();

router.get('/', auth, async (req, res, next) => {
  try {
    const posts = await Post.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (e) {
    next(e);
  }
});

router.get('/queue/stats', auth, async (req, res, next) => {
  try {
    const queue = await getQueueStats();
    const userPostStats = await Post.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const byStatus = userPostStats.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    res.json({
      queue,
      posts: {
        draft: byStatus.draft || 0,
        scheduled: byStatus.scheduled || 0,
        posted: byStatus.posted || 0,
        failed: byStatus.failed || 0,
      },
    });
  } catch (e) {
    next(e);
  }
});

router.patch('/:postId', auth, validatePostPatchPayload, async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findOne({ _id: postId, user: req.user._id });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const updates = { ...req.body };
    if ('scheduledFor' in updates) {
      const parsedDate = updates.scheduledFor ? new Date(updates.scheduledFor) : null;
      if (updates.scheduledFor && Number.isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: 'Invalid scheduledFor date' });
      }
      if (parsedDate && parsedDate.getTime() < Date.now() - 30000) {
        return res.status(400).json({ error: 'scheduledFor must be in the future' });
      }

      updates.scheduledFor = parsedDate;

      await removeScheduledPostJob(postId);
      if (parsedDate) {
        updates.status = 'scheduled';
        await schedulePostPublish(postId, req.user._id, parsedDate);
      } else if (post.status === 'scheduled') {
        updates.status = 'draft';
      }
    }

    const updated = await Post.findByIdAndUpdate(postId, updates, { new: true });
    res.json(updated);
  } catch (e) {
    next(e);
  }
});

export default router;
