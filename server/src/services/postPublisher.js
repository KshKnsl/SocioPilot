import Post from '../models/Post.js';
import { getUserTwitterClient } from './twitterService.js';

export async function publishPostById(postId, userId) {
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error(`Post not found: ${postId}`);
  }

  if (String(post.user) !== String(userId)) {
    throw new Error('Post owner mismatch');
  }

  if (post.platform?.toLowerCase() !== 'twitter') {
    throw new Error(`Unsupported platform for publishing: ${post.platform}`);
  }

  if (!post.content || !post.content.trim()) {
    throw new Error('Cannot publish empty content');
  }

  post.status = 'posted';
  post.scheduledFor = null;
  post.publishError = null;

  try {
    const client = await getUserTwitterClient(userId);
    const tweet = await client.v2.tweet(post.content);
    post.platformPostId = tweet?.data?.id || null;
    await post.save();
    return post;
  } catch (error) {
    post.status = 'failed';
    post.publishError = error?.message || 'Publish failed';
    await post.save();
    throw error;
  }
}
