import { generate } from '../services/llmService.js';

export class PostGenerator {
  constructor(brand, platform, idea, language, postsPromptExpansion, model, providerApiKey) {
    this.brand = brand;
    this.platform = platform;
    this.idea = idea;
    this.language = language;
    this.postsPromptExpansion = postsPromptExpansion;
    this.model = model;
    this.providerApiKey = providerApiKey;
  }

  async generate() {
    const postPrompt = `Write a ${this.platform === 'Twitter' ? 'Tweet' : this.platform + ' post'} in ${this.language} for their account that talks about '${this.idea}'\n\nNote: avoid including any text or ideas which requires up-to-date information, or which could contain false data, or which mentions a real link or offered product/service` + 
      (this.postsPromptExpansion ? `\n\nTake this also into account: ${this.postsPromptExpansion}` : '') + 
      (this.brand.style.length ? `\n\nFollow these style guidelines: ${this.brand.style.join(', ')}` : '');

    const messages = [
      { role: 'system', content: this.brand.description },
      { role: 'user', content: postPrompt }
    ];

    const content = await generate(messages, { modelName: this.model, apiKey: this.providerApiKey });
    return content.trim();
  }
}
