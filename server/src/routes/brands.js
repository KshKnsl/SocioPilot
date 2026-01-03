import express from 'express';
import Brand from '../models/Brand.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const brands = await Brand.find().sort({ createdAt: -1 });
    res.json(brands);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, style } = req.body;
    const brand = new Brand({ title, description, style });
    await brand.save();
    res.status(201).json(brand);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
