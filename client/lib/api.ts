const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function getBrands() {
  const res = await fetch(`${API_URL}/api/brands`);
  if (!res.ok) throw new Error(`Failed to fetch brands: ${res.statusText}`);
  return res.json();
}

export async function createBrand(payload: { title: string; description: string; style?: string[] }) {
  const res = await fetch(`${API_URL}/api/brands`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Failed to create brand: ${res.statusText}`);
  return res.json();
}

export async function generate(payload: any) {
  const body = JSON.stringify(payload);
  const res = await fetch(`${API_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Generation failed: ${res.status} ${txt}`);
  }
  return res.json();
}
