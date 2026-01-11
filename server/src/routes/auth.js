import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
router.post('/register', async (req, res) => {
  try {
    const { email, password, brand } = req.body;
    const user = new User({ email, password, brand: brand || {} });
    await user.save();
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, email: user.email, brand: user.brand } });
  } catch (e) {
    next(e);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      const err = new Error('Invalid credentials');
      err.status = 401;
      return next(err);
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, brand: user.brand } });
  } catch (e) {
    next(e);
  }
});

router.put('/me', auth, async (req, res) => {
  try {
    const { brand } = req.body;
    const user = await User.findById(req.user.id);
    user.brand = { ...user.brand, ...brand };
    await user.save();
    res.json({ user: { id: user._id, email: user.email, brand: user.brand } });
  } catch (e) {
    next(e);
  }
});

export default router;
