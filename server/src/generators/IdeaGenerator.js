import { generate } from '../services/llmService.js';

export class IdeaGenerator {
  constructor(brand, topic, ideasPerTopic, topicsPromptExpansion, model, providerApiKey) {
    this.brand = brand;
    this.topic = topic;
    this.ideasPerTopic = ideasPerTopic;
    this.topicsPromptExpansion = topicsPromptExpansion;
    this.model = model;
    this.providerApiKey = providerApiKey;
  }

  async generate() {
    let ideaPrompt = `Create a list of ${this.ideasPerTopic} social media post ideas (concise and specific) for their account about the topic '${this.topic}' in the format '- ...\n- ...'`;
    if (this.topicsPromptExpansion) ideaPrompt += `\n\nTake this also into account: ${this.topicsPromptExpansion}`;

    const messages = [
      { role: 'system', content: this.brand.description },
      { role: 'user', content: ideaPrompt }
    ];

    const text = await generate(messages, { modelName: this.model, apiKey: this.providerApiKey });
    return this.parseList(text).slice(0, this.ideasPerTopic);
  }

  parseList(text) {
    return text
      .split('\n')
      .map((l) => l.replace(/^\s*-\s*/, '').trim())
      .filter((l) => l.length > 0);
  }
}
