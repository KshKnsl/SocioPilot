import { TwitterApi } from 'twitter-api-v2';
import SocialAccount from '../models/SocialAccount.js';
import { decryptKey } from '../utils/encryption.js';

export async function getUserTwitterClient(userId) {
  const account = await SocialAccount.findOne({ user: userId, platform: 'twitter', status: 'connected' });
  if (!account) throw new Error('No connected Twitter account');
  const creds = JSON.parse(decryptKey(Buffer.from(account.encryptedCredentials, 'hex')));
  return new TwitterApi(creds.accessToken);
}
