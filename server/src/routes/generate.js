import express from 'express';
import Post from '../models/Post.js';
import ProviderKey from '../models/ProviderKey.js';
import { auth } from '../middleware/auth.js';
import { IdeaGenerator } from '../generators/IdeaGenerator.js';
import { PostGenerator } from '../generators/PostGenerator.js';
import { ImageGenerator } from '../generators/ImageGenerator.js';
import { decryptKey } from '../utils/encryption.js';
const router = express.Router();

async function getProviderApiKey(userId, provider) {
  if (!provider) return null;
  const doc = await ProviderKey.findOne({ user: userId, provider });
  if (!doc) return null;
  return decryptKey(doc.encryptedKey);
}

router.post('/', auth, async (req, res) => {
  try {
    const {
      topicCount = 3,
      language = 'English',
      platforms = ['Twitter'],
      topicsPromptExpansion = '',
      postsPromptExpansion = '',
      generateImages = false,
      model = null,
      provider = null,
      tone = 'professional'
    } = req.body;

    const providerApiKey = await getProviderApiKey(req.user._id, provider);
    const brand = req.user.brand;
    const ideaGenerator = new IdeaGenerator(brand, topicCount, topicsPromptExpansion, model, providerApiKey, tone);
    const ideas = await ideaGenerator.generate();
    const results = [];
    for (const idea of ideas) 
    {
      const platformResults = [];
      for (const platform of platforms) {
        const postGenerator = new PostGenerator(brand, platform, idea, language, postsPromptExpansion, model, providerApiKey, tone);
        const content = await postGenerator.generate();
        let imageFilename = null;
        if (generateImages) 
          {
          const imagePromptGenerator = new ImageGenerator(brand, idea, model, providerApiKey, tone);
          imageFilename = await imagePromptGenerator.generate();
        }
        platformResults.push({ platform, content, imageFilename });
      }
      results.push({ idea, platforms: platformResults });
    }
    const allIdeas = results.map(r => r.idea);
    const posts = [];
    results.forEach(r => {
      r.platforms.forEach(p => {
        posts.push({ platform: p.platform, content: p.content, imageFilename: p.imageFilename, idea: r.idea });
      });
    });
    const createdPosts = [];
    for (const p of posts) {
      const doc = new Post({ user: req.user._id, platform: p.platform, content: p.content, imageFilename: p.imageFilename, topic: p.idea, status: 'draft', scheduledFor: null });
      await doc.save();
      createdPosts.push(doc);
    }
    res.json({ ideas: allIdeas, posts: createdPosts });
  } catch (e) {
    next(e);
  }
});

export default router;
