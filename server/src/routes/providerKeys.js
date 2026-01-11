import express from 'express';
import { auth } from '../middleware/auth.js';
import ProviderKey from '../models/ProviderKey.js';

const router = express.Router();
router.get('/', auth, async (req, res) => {
  try {
    const keys = await ProviderKey.find({ user: req.user.id });
    const mapped = keys.reduce((acc, k) => ({ ...acc, [k.provider]: k.key }), {});
    res.json(mapped);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { provider, key } = req.body;
    const updated = await ProviderKey.findOneAndUpdate(
      { user: req.user.id, provider },
      { key },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ provider: updated.provider, key: updated.key });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;