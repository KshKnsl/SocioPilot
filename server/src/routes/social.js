
import express from 'express';
import { auth } from '../middleware/auth.js';
import SocialAccount from '../models/SocialAccount.js';
import { encryptKey, decryptKey } from '../utils/encryption.js';
import { TwitterApi } from 'twitter-api-v2';
import { getUserTwitterClient } from '../services/twitterService.js';

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

router.get('/twitter/start', auth, async (req, res, next) => {
  console.log('Starting Twitter OAuth flow');
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
    console.log('Stored OAuth data for user:', req.user.id, 'state:', state);
    res.json({ url });
  } catch (e) { next(e); }
});

router.get('/twitter/callback', async (req, res, next) => {
  try {
    const { code, state } = req.query;
    console.log('Twitter callback received:', { code: !!code, state });
    if (!code || !state) return res.status(400).json({ error: 'Missing code or state' });
    
    const accounts = await SocialAccount.find({ platform: 'twitter', status: 'pending' });
    console.log('Found pending accounts:', accounts.length);
    
    let oauthData = null;
    let accountId = null;

    for (const account of accounts) {
      try {
        const decrypted = JSON.parse(decryptKey(Buffer.from(account.encryptedCredentials, 'hex')));
        console.log('Checking account:', account._id, 'decrypted state:', decrypted.state, 'target state:', state);
        if (decrypted.state === state && decrypted.status === 'pending') {
          oauthData = decrypted;
          accountId = account._id;
          console.log('Found matching account!');
          break;
        }
      } catch (e) {
        console.log('Error decrypting account:', account._id, e.message);
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
