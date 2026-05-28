import { generate } from '../services/llmService.js';
import { getPostPrompt } from '../utils/prompts.js';

export class PostGenerator {
  constructor(brand, platform, idea, language, postsPromptExpansion, model, providerApiKey, tone) {
    this.brand = brand;
    this.platform = platform;
    this.idea = idea;
    this.language = language;
    this.postsPromptExpansion = postsPromptExpansion;
    this.model = model;
    this.providerApiKey = providerApiKey;
    this.tone = tone;
  }

  async generate() {
    const messages = [
      { role: 'system', content: this.brand.description },
      { role: 'user', content: getPostPrompt(this.platform, this.language, this.idea, this.postsPromptExpansion, this.brand.style, this.tone) }
    ];

    const content = await generate(messages, { modelName: this.model, apiKey: this.providerApiKey });
    return content.trim();
  }
}
