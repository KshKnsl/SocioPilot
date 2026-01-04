import { generate } from '../services/llmService.js';

export class TopicGenerator {
  constructor(brand, topicCount, topicsPromptExpansion, model, providerApiKey) {
    this.brand = brand;
    this.topicCount = topicCount;
    this.topicsPromptExpansion = topicsPromptExpansion;
    this.model = model;
    this.providerApiKey = providerApiKey;
  }

  async generate() {
    let topicPrompt = `Create a list of ${this.topicCount} general topics or fields to cover in their social media posts, in the format '- ...\n- ...'\n\nNote: avoid including any text or ideas which requires up-to-date information, or which could contain false data, or which mentions a real link or offered product/service`;
    if (this.topicsPromptExpansion) topicPrompt += `\n\nTake this also into account: ${this.topicsPromptExpansion}`;

    const messages = [
      { role: 'system', content: this.brand.description },
      { role: 'user', content: topicPrompt }
    ];

    const text = await generate(messages, { modelName: this.model, apiKey: this.providerApiKey });
    return this.parseList(text).slice(0, this.topicCount);
  }

  parseList(text) {
    if (typeof text !== 'string') return [];
    return text
      .split('\n')
      .map((l) => l.replace(/^\s*-\s*/, '').trim())
      .filter((l) => l.length > 0);
  }
}
