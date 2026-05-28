import express from 'express';
import { auth } from '../middleware/auth.js';
import ProviderKey from '../models/ProviderKey.js';
import { encryptKey } from '../utils/encryption.js';

const router = express.Router();

router.post('/', auth, async (req, res, next) => {
  try {
    const { provider, key } = req.body;
    if (!provider || typeof provider !== 'string') {
      return res.status(400).json({ error: 'provider is required' });
    }
    if (!key || typeof key !== 'string' || !key.trim()) {
      return res.status(400).json({ error: 'key is required' });
    }

    const updated = await ProviderKey.findOneAndUpdate(
      { user: req.user._id, provider },
      { encryptedKey: encryptKey(key.trim()) },
      { upsert: true, new: true }
    );
    res.status(200).json({ provider: updated.provider, success: true });
  } catch (e) {
    next(e);
  }
});

export default router;