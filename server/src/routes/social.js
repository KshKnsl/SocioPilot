import express from 'express';
import { auth } from '../middleware/auth.js';
import SocialAccount from '../models/SocialAccount.js';
import { encryptKey, decryptKey } from '../utils/encryption.js';
import { TwitterApi } from 'twitter-api-v2';
import { getUserTwitterClient } from '../services/twitterService.js';
import { fetchTweets, } from 'nitter-scraper';

const router = express.Router();

router.get('/twitter/status', auth, async (req, res, next) => {
  try {
    const acc = await SocialAccount.findOne({ user: req.user._id, platform: 'twitter', status: 'connected' });
    res.json({ connected: !!acc });
  } catch (e) { next(e); }
});


router.post('/twitter/tweet', auth, async (req, res, next) => {
  try {
    const tweet = await (await getUserTwitterClient(req.user._id)).v2.tweet(req.body.text);
    res.json({ tweet });
  } catch (e) { next(e); }
});

router.get('/twitter/analytics', auth, async (req, res, next) => {
  try {
    const client = await getUserTwitterClient(req.user._id);
    const user = await client.v2.me({ 'user.fields': ['public_metrics', 'verified', 'created_at'] });
    res.json(user.data);
  } catch (e) {
    next(e);
  }
});

router.get('/twitter/nitterTweets', async (req, res, next) => {
  try {
    const { username } = req.query;
    const tweets = await fetchTweets(username, undefined, 1, true);
    res.json(tweets);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch tweets from Nitter', details: e.message });
  }
});

router.get('/twitter/start', auth, async (req, res, next) => {
  try {
    const client = new TwitterApi({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
    });
    const { url, codeVerifier, state } = client.generateOAuth2AuthLink(
      process.env.TWITTER_CALLBACK_URL,
      { scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'] }
    );
    await SocialAccount.findOneAndUpdate(
      { user: req.user._id, platform: 'twitter' },
      {
        credentials: JSON.stringify({ codeVerifier, state }),
        status: 'pending',
        state: state,
      },
      { upsert: true, new: true }
    );
    res.json({ url });
  } catch (e) { next(e); }
});

router.get('/twitter/callback', async (req, res, next) => {
  try {
    const { code, state } = req.query;
    if (!code || !state) return res.status(400).json({ error: 'Missing code or state' });
    const account = await SocialAccount.findOne({ state, status: 'pending' });
    if (!account) {
      return res.status(400).json({ error: 'Invalid or expired state' });
    }

    const decrypted = JSON.parse(account.credentials);

    const client = new TwitterApi({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
    });
    const { client: loggedClient, accessToken, refreshToken, expiresIn, scope } = await client.loginWithOAuth2({
      code,
      codeVerifier: decrypted.codeVerifier,
      redirectUri: process.env.TWITTER_CALLBACK_URL,
    });
    const user = await loggedClient.v2.me();
    await SocialAccount.findByIdAndUpdate(account._id, {
      credentials: encryptKey(JSON.stringify({ accessToken, refreshToken, expiresIn, scope })).toString('hex'),
      username: user.data.username,
      status: 'connected',
      state: null, 
    });

    res.redirect('http://localhost:3000/dashboard/settings');
  } catch (e) { next(e); }
});

export default router;
