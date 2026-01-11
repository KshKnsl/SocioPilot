import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';

import authRoute from './routes/auth.js';
import generateRoute from './routes/generate.js';
import postsRoute from './routes/posts.js';
import providerKeysRoute from './routes/providerKeys.js';

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use('/api/auth', authRoute);
app.use('/api/generate', generateRoute);
app.use('/api/posts', postsRoute);
app.use('/api/provider-keys', providerKeysRoute);
app.use('/images', express.static('results/images'));

const PORT = 4000;

try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
} catch (err) {
  console.error('Failed to connect to MongoDB', err);
}
