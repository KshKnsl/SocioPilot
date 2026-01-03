import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

export async function generateImage(prompt) {
  const hfToken = process.env.HUGGINGFACE_API_TOKEN;
  if (!hfToken) {
    throw new Error('HUGGINGFACE_API_TOKEN not set');
  }
  const API_URL = 'https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4';
  const headers = { 'Authorization': `Bearer ${hfToken}`, 'X-Use-Cache': 'false' };

  const res = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ inputs: prompt })
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`HF Error: ${txt}`);
  }

  const buffer = await res.arrayBuffer();
  const buf = Buffer.from(buffer);

  const dir = path.join(process.cwd(), 'results', 'images');
  fs.mkdirSync(dir, { recursive: true });
  const filename = `post_${Date.now()}.png`;
  fs.writeFileSync(path.join(dir, filename), buf);
  return filename;
}
