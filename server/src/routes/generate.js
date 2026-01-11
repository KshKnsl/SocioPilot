import express from 'express';
import Post from '../models/Post.js';
import { auth } from '../middleware/auth.js';
import { generateImage } from '../services/imageService.js';
import { IdeaGenerator } from '../generators/IdeaGenerator.js';
import { PostGenerator } from '../generators/PostGenerator.js';
import { ImagePromptGenerator } from '../generators/ImagePromptGenerator.js';

const router = express.Router();

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
      providerApiKey = null,
      tone = 'professional',
      voice = ''
    } = req.body;

    const brand = req.user.brand;
    if (!brand || !brand.title) {
      return res.status(400).json({ error: 'Brand not configured. Please update your brand in settings.' });
    }

    const ideaGenerator = new IdeaGenerator(brand, topicCount, topicsPromptExpansion, model, providerApiKey, tone, voice);
    const ideas = await ideaGenerator.generate();

    const results = [];
    for (const idea of ideas) {
      const platformResults = [];
      for (const platform of platforms) {
        const postGenerator = new PostGenerator(brand, platform, idea, language, postsPromptExpansion, model, providerApiKey, tone, voice);
        const content = await postGenerator.generate();

        let imageFilename = null;
        if (generateImages) {
          const imagePromptGenerator = new ImagePromptGenerator(brand, idea, model, providerApiKey, tone, voice);
          const imagePrompt = await imagePromptGenerator.generate();
          imageFilename = await generateImage(imagePrompt);
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
      const doc = new Post({ user: req.user.id, platform: p.platform, content: p.content, imageFilename: p.imageFilename, topic: p.idea, status: 'draft', scheduledFor: null });
      await doc.save();
      createdPosts.push(doc);
    }

    res.json({ ideas: allIdeas, posts: createdPosts });
  } catch (e) {
    console.error('Generation error:', e);
    res.status(500).json({ error: e.message });
  }
});

export default router;
