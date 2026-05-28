import { TwitterApi } from 'twitter-api-v2';
import SocialAccount from '../models/SocialAccount.js';
import { decryptKey, encryptKey } from '../utils/encryption.js';

export async function getUserTwitterClient(userId) {
  const account = await SocialAccount.findOne({ user: userId, platform: 'twitter', status: 'connected' });
  if (!account) throw new Error('No connected Twitter account');

  if (!account.credentials) {
    // Credentials missing — mark disconnected and prompt re-connect
    await SocialAccount.findByIdAndUpdate(account._id, {
      status: 'disconnected',
      credentials: null
    });
    const err = new Error('Twitter account credentials missing. Please reconnect your account.');
    err.status = 401;
    throw err; 
  }

  let creds;
  try {
    creds = JSON.parse(decryptKey(Buffer.from(account.credentials, 'hex')));
  } catch (err) {
    console.error('Failed to decrypt or parse Twitter credentials:', err.message);

    // Mark the account as disconnected to avoid repeated errors
    await SocialAccount.findByIdAndUpdate(account._id, {
      status: 'disconnected',
      credentials: null
    });

    err.status = 401;
    throw err; 
  }

  if (!creds || !creds.accessToken) {
    // No usable tokens — mark disconnected and tell user to reconnect
    await SocialAccount.findByIdAndUpdate(account._id, {
      status: 'disconnected',
      credentials: null
    });
    const err = new Error('Twitter credentials incomplete. Please reconnect your account.');
    err.status = 401;
    throw err; 
  }

  const resolvedExpiry = creds.expiresAt || (creds.expiresIn ? Date.now() + Number(creds.expiresIn) * 1000 : null);
  if (resolvedExpiry && Date.now() > (resolvedExpiry - 300000)) {
    console.log('Token expired, refreshing...');

    try {
      const client = new TwitterApi({
        clientId: process.env.TWITTER_CLIENT_ID,
        clientSecret: process.env.TWITTER_CLIENT_SECRET,
      });

      const { accessToken, refreshToken, expiresIn } = await client.refreshOAuth2Token(creds.refreshToken);

      creds = {
        ...creds,
        accessToken,
        refreshToken,
        expiresAt: Date.now() + (expiresIn * 1000)
      };

      await SocialAccount.findByIdAndUpdate(account._id, {
        credentials: encryptKey(JSON.stringify(creds)).toString('hex')
      });

      console.log('Token refreshed successfully');
    } catch (refreshError) {
      console.error('Token refresh failed:', refreshError.message);

      await SocialAccount.findByIdAndUpdate(account._id, {
        status: 'disconnected',
        credentials: null
      });

      throw new Error('Twitter token expired and refresh failed. Please reconnect your account.');
    }
  }

  return new TwitterApi(creds.accessToken);
}
