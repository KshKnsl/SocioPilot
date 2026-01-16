import { generate } from '../services/llmService.js';
import { generateImage } from '../services/imageService.js';
import { getImageSystemPrompt, getImageUserPrompt } from '../utils/prompts.js';

export class ImageGenerator {
  constructor(brand, idea, model, providerApiKey, tone, voice) {
    this.brand = brand;
    this.idea = idea;
    this.model = model;
    this.providerApiKey = providerApiKey;
    this.tone = tone;
    this.voice = voice;
  }

  async generate() {
    const messages = [
      { role: 'system', content: getImageSystemPrompt(this.brand.description, this.tone, this.voice) },
      { role: 'user', content: getImageUserPrompt(this.idea) }
    ];

    const prompt = await generate(messages, { modelName: this.model, apiKey: this.providerApiKey });
    return await generateImage(prompt);
  }
}
