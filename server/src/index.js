import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import brandsRoute from './routes/brands.js';
import generateRoute from './routes/generate.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/api/brands', brandsRoute);
app.use('/api/generate', generateRoute);
app.use('/images', express.static('results/images'));

const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });
