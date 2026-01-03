import { generate } from '../services/llmService.js';

export class ImagePromptGenerator {
  constructor(brand, idea, model, providerApiKey) {
    this.brand = brand;
    this.idea = idea;
    this.model = model;
    this.providerApiKey = providerApiKey;
  }

  async generate() {
    const messages = [
      { role: 'system', content: this.brand.description },
      { role: 'user', content: `Define with 10-20 words the description for the image that will be used for the following post idea:\n\n'${this.idea}'.\n\nNote: You should describe all the items we will see in the image, and those items should NOT include people's faces, hands, text or animals, device screens or anything that could contain text.` }
    ];

    const prompt = await generate(messages, { modelName: this.model, apiKey: this.providerApiKey });
    return prompt;
  }
}
