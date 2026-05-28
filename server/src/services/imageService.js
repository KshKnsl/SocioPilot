import { InferenceClient } from '@huggingface/inference';
import { uploadBuffer } from './cloudinaryService.js';
export async function generateImage(prompt) {
  const client = new InferenceClient(process.env.HUGGINGFACE_API_TOKEN);
  const blob = await client.textToImage({
    provider: "auto",
    model: "stabilityai/stable-diffusion-xl-base-1.0",
    inputs: prompt,
    parameters: { num_inference_steps: 5 },
  });
  const buffer = await blob.arrayBuffer();
  const buf = Buffer.from(buffer);
  const filename = `post_${Date.now()}.png`;
  const result = await uploadBuffer(buf, filename);
  return result.secure_url;
} 
