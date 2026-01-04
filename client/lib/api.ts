const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem("sp_token");
  if (token) {
    return { 'Authorization': `Bearer ${token}` };
  }
  return {};
}

export async function login(payload: any) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Login failed");
  }
  return res.json();
}

export async function register(payload: any) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Registration failed");
  }
  return res.json();
}

export async function getBrands() {
  const res = await fetch(`${API_URL}/api/brands`, {
    headers: { ...getAuthHeader() }
  });
  if (!res.ok) throw new Error(`Failed to fetch brands: ${res.statusText}`);
  return res.json();
}

export async function createBrand(payload: { title: string; description: string; style?: string[] }) {
  const res = await fetch(`${API_URL}/api/brands`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Failed to create brand: ${res.statusText}`);
  return res.json();
}

export async function generate(payload: any) {
  const body = JSON.stringify(payload);
  const res = await fetch(`${API_URL}/api/generate`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body,
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Generation failed: ${res.status} ${txt}`);
  }
  return res.json();
}

export async function getResults() {
  const res = await fetch(`${API_URL}/api/results`, {
    headers: { ...getAuthHeader() }
  });
  if (!res.ok) throw new Error(`Failed to fetch results: ${res.statusText}`);
  return res.json();
}
