
import express from 'express';
import { auth } from '../middleware/auth.js';
import SocialAccount from '../models/SocialAccount.js';
import { encryptKey, decryptKey } from '../utils/encryption.js';
import { TwitterApi } from 'twitter-api-v2';
import { getUserTwitterClient } from '../services/twitterService.js';
import { fetchTweets } from 'nitter-scraper';

const router = express.Router();

router.get('/twitter/status', auth, async (req, res, next) => {
  try {
    const acc = await SocialAccount.findOne({ user: req.user.id, platform: 'twitter', status: 'connected' });
    res.json({ connected: !!acc });
  } catch (e) { next(e); }
});


router.post('/twitter/tweet', auth, async (req, res, next) => {
  try {
    const tweet = await (await getUserTwitterClient(req.user.id)).v2.tweet(req.body.text);
    res.json({ tweet });
  } catch (e) { next(e); }
});

router.get('/twitter/analytics', auth, async (req, res, next) => {
  try {
    const client = await getUserTwitterClient(req.user.id);
    const user = await client.v2.me({ 'user.fields': ['public_metrics', 'verified', 'created_at'] });
    res.json(user.data);
  } catch (e) {
    next(e);
  }
});

router.get('/twitter/rss', async (req, res, next) => {
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ error: 'Username parameter required' });
    }

    console.log('Fetching tweets for username:', username);
    const tweets = await fetchTweets(username, undefined, 1, true);
    console.log('Fetched tweets from nitter-scraper:', tweets?.length || 0);
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
      { user: req.user.id, platform: 'twitter' },
      {
        encryptedCredentials: encryptKey(JSON.stringify({ codeVerifier, state, status: 'pending' })).toString('hex'),
        status: 'pending',
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
    
    const accounts = await SocialAccount.find({ platform: 'twitter', status: 'pending' });
    
    let oauthData = null;
    let accountId = null;

    for (const account of accounts) {
      try {
        const decrypted = JSON.parse(decryptKey(Buffer.from(account.encryptedCredentials, 'hex')));
        if (decrypted.state === state && decrypted.status === 'pending') {
          oauthData = decrypted;
          accountId = account._id;
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (!oauthData || !accountId) {
      console.log('No matching account found');
      return res.status(400).json({ error: 'Invalid or expired state' });
    }

    const client = new TwitterApi({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
    });
    const { client: loggedClient, accessToken, refreshToken, expiresIn, scope } = await client.loginWithOAuth2({
      code,
      codeVerifier: oauthData.codeVerifier,
      redirectUri: process.env.TWITTER_CALLBACK_URL,
    });
    const user = await loggedClient.v2.me();
    await SocialAccount.findByIdAndUpdate(accountId, {
      encryptedCredentials: encryptKey(JSON.stringify({ accessToken, refreshToken, expiresIn, scope })).toString('hex'),
      username: user.data.username,
      profileImage: user.data.profile_image_url,
      status: 'connected',
    });

    res.redirect('http://localhost:3000/dashboard/settings');
  } catch (e) { next(e); }
});

export default router;
