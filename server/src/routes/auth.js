import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ProviderKey from '../models/ProviderKey.js';
import { auth } from '../middleware/auth.js';
const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const { email, password, brand } = req.body;
    const user = new User({ email, password, brand: brand || {} });
    await user.save();
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token });
  } catch (e) {
    next(e);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      const err = new Error('Invalid credentials');
      err.status = 401;
      return next(err);
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (e) {
    next(e);
  }
});

router.get('/me', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password').lean();
    const providerDocs = await ProviderKey.find({ user: req.user._id });
    const providers = providerDocs.map(p => p.provider);
    res.json({ user: { ...(user || {}), providers } });
  } catch (e) {
    next(e);
  }
});

router.put('/me', auth, async (req, res, next) => {
  try {
    const { brand } = req.body;
    const user = await User.findById(req.user._id);
    user.brand = { ...user.brand, ...brand };
    await user.save();
    res.json({ user });
  } catch (e) {
    next(e);
  }
});

export default router;
