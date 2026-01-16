import express from 'express';
import { auth } from '../middleware/auth.js';
import ProviderKey from '../models/ProviderKey.js';
import { encryptKey } from '../utils/encryption.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const providers = await ProviderKey.find({ user: req.user._id });
    res.json(providers.map(p => p.provider));
  } catch (e) {
    next(e);
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { provider, key } = req.body;
    const updated = await ProviderKey.findOneAndUpdate(
      { user: req.user._id, provider },
      { encryptedKey: encryptKey(key)},
      { upsert: true, new: true }
    );
    res.status(200).json({ provider: updated.provider, success: true });
  } catch (e) {
    next(e);
  }
});

export default router;