import { generate } from '../services/llmService.js';
import { getIdeaPrompt } from '../utils/prompts.js';

export class IdeaGenerator {
  constructor(brand, ideasCount, topicsPromptExpansion, model, providerApiKey, tone, voice) {
    this.brand = brand;
    this.ideasCount = ideasCount;
    this.topicsPromptExpansion = topicsPromptExpansion;
    this.model = model;
    this.providerApiKey = providerApiKey;
    this.tone = tone;
    this.voice = voice;
  }

  async generate() {
    const ideaPrompt = getIdeaPrompt(this.ideasCount, this.topicsPromptExpansion, this.tone, this.voice);

    const messages = [
      { role: 'system', content: this.brand.description },
      { role: 'user', content: ideaPrompt }
    ];

    const text = await generate(messages, { modelName: this.model, apiKey: this.providerApiKey });
    const ideas = JSON.parse(text);
    return ideas.slice(0, this.ideasCount);
  }
}
