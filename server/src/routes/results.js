import express from 'express';
import Result from '../models/Result.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const results = await Result.find()
      .populate({
        path: 'brand',
        match: { user: req.user.id }
      })
      .sort({ createdAt: -1 });
    
    const filtered = results.filter(r => r.brand !== null);
    res.json(filtered);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const result = await Result.findById(req.id).populate('brand');
    if (!result || result.brand.user.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Result not found' });
    }
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
