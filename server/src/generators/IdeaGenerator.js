import { generate } from '../services/llmService.js';
import { getIdeaPrompt } from '../utils/prompts.js';

export class IdeaGenerator {
  constructor(brand, ideasCount, topicsPromptExpansion, model, providerApiKey, tone) {
    this.brand = brand;
    this.ideasCount = ideasCount;
    this.topicsPromptExpansion = topicsPromptExpansion;
    this.model = model;
    this.providerApiKey = providerApiKey;
    this.tone = tone;
  }

  async generate() {
    const ideaPrompt = getIdeaPrompt(this.ideasCount, this.topicsPromptExpansion, this.tone);

    const messages = [
      { role: 'system', content: this.brand.description },
      { role: 'user', content: ideaPrompt }
    ];

    const text = await generate(messages, { modelName: this.model, apiKey: this.providerApiKey });
    try {
      const ideas = JSON.parse(text);
      if (Array.isArray(ideas)) {
        return ideas
          .map((x) => String(x).trim())
          .filter(Boolean)
          .slice(0, this.ideasCount);
      }
    } catch (_) {
      // Fall through to a line-based parse for imperfect model output.
    }

    const lineParsed = String(text)
      .split('\n')
      .map((line) => line.replace(/^[-*\d\.\)\s]+/, '').trim())
      .filter(Boolean)
      .slice(0, this.ideasCount);

    if (lineParsed.length === 0) {
      throw new Error('Failed to parse generated ideas');
    }

    return lineParsed;
  }
}
