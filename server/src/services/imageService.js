import fs from 'fs';
import path from 'path';
import { InferenceClient } from '@huggingface/inference';

export async function generateImage(prompt) {
  const hfToken = process.env.HUGGINGFACE_API_TOKEN;
  if (!hfToken) {
    throw new Error('HUGGINGFACE_API_TOKEN not set');
  }

  const client = new InferenceClient(hfToken);

  try {
    const blob = await client.textToImage({
      provider: "auto",
      model: "stabilityai/stable-diffusion-xl-base-1.0",
      inputs: prompt,
      parameters: { num_inference_steps: 5 },
    });

    const buffer = await blob.arrayBuffer();
    const buf = Buffer.from(buffer);

    const dir = path.join(process.cwd(), 'results', 'images');
    fs.mkdirSync(dir, { recursive: true });
    const filename = `post_${Date.now()}.png`;
    fs.writeFileSync(path.join(dir, filename), buf);
    return filename;
  } catch (error) {
    throw new Error(`HF Error: ${error.message}`);
  }
}
