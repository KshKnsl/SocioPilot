import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoute from './routes/auth.js';
import generateRoute from './routes/generate.js';
import postsRoute from './routes/posts.js';
import providerKeysRoute from './routes/providerKeys.js';
import socialRoute from './routes/social.js';

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/generate', generateRoute);
app.use('/api/posts', postsRoute);
app.use('/api/provider-keys', providerKeysRoute);
app.use('/api/social', socialRoute);
app.use('/images', express.static('results/images'));

const PORT = 4000;

await connectDB();
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
app.use(errorHandler);
