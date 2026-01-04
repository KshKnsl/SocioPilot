import express from 'express';
import Brand from '../models/Brand.js';
import Result from '../models/Result.js';
import { auth } from '../middleware/auth.js';
import { generateImage } from '../services/imageService.js';
import { TopicGenerator } from '../generators/TopicGenerator.js';
import { IdeaGenerator } from '../generators/IdeaGenerator.js';
import { PostGenerator } from '../generators/PostGenerator.js';
import { ImagePromptGenerator } from '../generators/ImagePromptGenerator.js';

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const {
      brandId,
      topicCount = 3,
      ideasPerTopic = 2,
      language = 'English',
      platforms = ['Twitter'],
      topicsPromptExpansion = '',
      postsPromptExpansion = '',
      generateImages = false,
      model = null,
      providerApiKey = null
    } = req.body;

    if (!brandId) {
      return res.status(400).json({ error: 'brandId is required' });
    }

    const brand = await Brand.findOne({ _id: brandId, user: req.user.id });
    if (!brand) {
      return res.status(404).json({ error: 'Brand not found or unauthorized' });
    }

    const topicGenerator = new TopicGenerator(brand, topicCount, topicsPromptExpansion, model, providerApiKey);
    const topics = await topicGenerator.generate();

    const resultsByTopic = [];
    for (const topic of topics) {
      const ideaGenerator = new IdeaGenerator(brand, topic, ideasPerTopic, topicsPromptExpansion, model, providerApiKey);
      const ideas = await ideaGenerator.generate();

      const ideaResults = [];
      for (const idea of ideas) {
        const platformResults = [];
        for (const platform of platforms) {
          const postGenerator = new PostGenerator(brand, platform, idea, language, postsPromptExpansion, model, providerApiKey);
          const content = await postGenerator.generate();

          let imageFilename = null;
          let imagePrompt = null;
          if (generateImages) {
            const imagePromptGenerator = new ImagePromptGenerator(brand, idea, model, providerApiKey);
            imagePrompt = await imagePromptGenerator.generate();
            try {
              imageFilename = await generateImage(imagePrompt);
            } catch (e) {
              console.warn('Image generation failed:', e.message);
            }
          }

          platformResults.push({ platform, content, imageFilename, imagePrompt, idea });
        }
        ideaResults.push(platformResults);
      }
      resultsByTopic.push(ideaResults);
    }
    
    const allIdeas = [];
    const posts = [];
    const imagePrompts = [];

    resultsByTopic.forEach(topicResults => {
      topicResults.forEach(ideaResults => {
        ideaResults.forEach(res => {
          if (!allIdeas.includes(res.idea)) allIdeas.push(res.idea);
          posts.push({ platform: res.platform, content: res.content, imageFilename: res.imageFilename });
          if (res.imagePrompt) imagePrompts.push(res.imagePrompt);
        });
      });
    });

    const result = new Result({ brand: brand._id, topics, ideas: allIdeas, posts, imagePrompts });
    await result.save();

    res.json({ resultId: result._id, topics, ideas: allIdeas, posts, imagePrompts });
  } catch (e) {
    console.error('Generation error:', e);
    res.status(500).json({ error: e.message });
  }
});

export default router;
