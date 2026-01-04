const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function getAuthHeader(): Record<string, string> {
  try {
    if (typeof window === 'undefined') return {};
    const token = localStorage.getItem("sp_token");
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  } catch (e) {
  }
  return {};
}

export async function login(payload: any): Promise<any> {
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

export async function register(payload: any): Promise<any> {
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

export async function getBrands(): Promise<any> {
  const res = await fetch(`${API_URL}/api/brands`, {
    headers: { ...getAuthHeader() }
  });
  if (!res.ok) throw new Error(`Failed to fetch brands: ${res.statusText}`);
  return res.json();
}

export async function createBrand(payload: { title: string; description: string; style?: string[] }): Promise<any> {
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

export async function generate(payload: any): Promise<any> {
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

export async function getPosts(brandId?: string): Promise<any> {
  const url = new URL(`${API_URL}/api/posts`);
  if (brandId) url.searchParams.set('brandId', brandId);
  const res = await fetch(url.toString(), { headers: { ...getAuthHeader() } });
  if (!res.ok) throw new Error(`Failed to fetch posts: ${res.statusText}`);
  return res.json();
}

export async function getProviderKeys(): Promise<Record<string, string>> {
  const res = await fetch(`${API_URL}/api/provider-keys`, { headers: { ...getAuthHeader() } });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Failed to fetch provider keys: ${res.statusText}`);
  }
  return res.json();
}

export async function setProviderKey(provider: string, key: string): Promise<any> {
  const res = await fetch(`${API_URL}/api/provider-keys`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ provider, key })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Failed to set provider key: ${res.statusText}`);
  }
  return res.json();
}



export async function updatePost(postId: string, updates: { content?: string, scheduledFor?: string | null }): Promise<any> {
  const res = await fetch(`${API_URL}/api/posts/${postId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(updates)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Failed to update post: ${res.statusText}`);
  }
  return res.json();
}


