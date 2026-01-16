const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function getAuthHeader(): Record<string, string> {
  try {
    if (typeof window === "undefined") return {};
    const token = localStorage.getItem("sp_token");
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  } catch (e) {}
  return {};
}

export async function login(payload: any): Promise<any> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Registration failed");
  }
  return res.json();
}

export async function updateUserBrand(brand: any) {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify({ brand }),
  });
  if (!res.ok) throw new Error(`Failed to update brand: ${res.statusText}`);
  return res.json();
}

export async function getCurrentUser() {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    method: "GET",
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error(`Failed to get user: ${res.statusText}`);
  return res.json();
}

export async function generate(payload: any): Promise<any> {
  const body = JSON.stringify(payload);
  const res = await fetch(`${API_URL}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body,
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Generation failed: ${res.status} ${txt}`);
  }
  return res.json();
}

export async function getProviderKeys(): Promise<string[]> {
  const res = await fetch(`${API_URL}/api/providerKeys`, {
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err.error || `Failed to fetch provider keys: ${res.statusText}`
    );
  }
  return res.json();
}

export async function setProviderKey(
  provider: string,
  key: string
): Promise<any> {
  const res = await fetch(`${API_URL}/api/providerKeys`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify({ provider, key }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err.error || `Failed to set provider key: ${res.statusText}`
    );
  }
  return res.json();
}

export async function updatePost(
  postId: string,
  updates: {
    content?: string;
    scheduledFor?: string | null;
    status?: string;
    platformPostId?: string | null;
  }
): Promise<any> {
  const res = await fetch(`${API_URL}/api/posts/${postId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Failed to update post: ${res.statusText}`);
  }
  return res.json();
}

export async function getTwitterStatus(): Promise<{ connected: boolean }> {
  const res = await fetch(`${API_URL}/api/social/twitter/status`, {
    headers: getAuthHeader(),
  });
  if (!res.ok)
    throw new Error(`Failed to get Twitter status: ${res.statusText}`);
  return res.json();
}

export async function startTwitterAuth(): Promise<{ url: string }> {
  const res = await fetch(`${API_URL}/api/social/twitter/start`, {
    headers: getAuthHeader(),
  });
  if (!res.ok)
    throw new Error(`Failed to start Twitter auth: ${res.statusText}`);
  return res.json();
}

export async function getTwitterAnalytics(): Promise<any> {
  const res = await fetch(`${API_URL}/api/social/twitter/analytics`, {
    headers: getAuthHeader(),
  });
  if (!res.ok)
    throw new Error(`Failed to get Twitter analytics: ${res.statusText}`);
  return res.json();
}
export async function getRecentTweets(username: string) {
  const res = await fetch(`${API_URL}/api/social/twitter/rss?username=${encodeURIComponent(username)}`, {
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error(`Failed to fetch tweets: ${res.statusText}`);
  return res.json();
}
