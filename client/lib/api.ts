const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

import { GenerateResponse, Post, QueueStatsResponse } from "./types";

async function toApiError(res: Response, fallback: string): Promise<Error> {
  try {
    const data = await res.json();
    if (data?.error) return new Error(data.error);
  } catch (_) {}
  return new Error(`${fallback}: ${res.status}`);
}

function getAuthHeader(): Record<string, string> {
  try {
    const token = localStorage.getItem("sp_token");
    if (token) return { Authorization: `Bearer ${token}` };
  } catch (e) {}
  return {};
}

export async function login(payload: { email: string; password: string }): Promise<any> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok)
    throw await toApiError(res, "Login failed");
  return res.json();
}

export async function register(payload: { email: string; password: string }): Promise<any> {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok)
    throw await toApiError(res, "Registration failed");
  return res.json();
}

export async function updateUserBrand(brand: any) {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify({ brand }),
  });
  if (!res.ok) throw await toApiError(res, "Failed to update brand");
  return res.json();
}

export async function getCurrentUser() {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    method: "GET",
    headers: getAuthHeader(),
  });
  if (!res.ok) throw await toApiError(res, "Failed to get user");
  return res.json();
}

export async function generate(payload: any): Promise<GenerateResponse> {
  const body = JSON.stringify(payload);
  const res = await fetch(`${API_URL}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body,
  });
  if (!res.ok)
    throw await toApiError(res, "Generation failed");
  return res.json();
}

export async function setProviderKey(
  provider: string,
  key: string
): Promise<any> {
  const res = await fetch(`${API_URL}/api/provider-keys`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify({ provider, key }),
  });
  if (!res.ok)
    throw await toApiError(res, "Failed to set provider key");
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
  if (!res.ok)
    throw await toApiError(res, "Failed to update post");
  return res.json();
}

export async function getPosts(): Promise<Post[]> {
  const res = await fetch(`${API_URL}/api/posts`, {
    method: "GET",
    headers: getAuthHeader(),
  });
  if (!res.ok)
    throw await toApiError(res, "Failed to fetch posts");
  return res.json();
}

export async function getQueueStats(): Promise<QueueStatsResponse> {
  const res = await fetch(`${API_URL}/api/posts/queue/stats`, {
    method: "GET",
    headers: getAuthHeader(),
  });
  if (!res.ok)
    throw await toApiError(res, "Failed to fetch queue stats");
  return res.json();
}

export async function getTwitterStatus(): Promise<{ connected: boolean }> {
  const res = await fetch(`${API_URL}/api/social/twitter/status`, {
    headers: getAuthHeader(),
  });
  if (!res.ok)
    throw await toApiError(res, "Failed to get Twitter status");
  return res.json();
}

export async function startTwitterAuth(): Promise<{ url: string }> {
  const res = await fetch(`${API_URL}/api/social/twitter/start`, {
    headers: getAuthHeader(),
  });
  if (!res.ok)
    throw await toApiError(res, "Failed to start Twitter auth");
  return res.json();
}

export async function getTwitterAnalytics(): Promise<any> {
  const res = await fetch(`${API_URL}/api/social/twitter/analytics`, {
    headers: getAuthHeader(),
  });
  if (!res.ok)
    throw await toApiError(res, "Failed to get Twitter analytics");
  return res.json();
}
export async function getRecentTweets(username: string) {
  const res = await fetch(`${API_URL}/api/social/twitter/nitterTweets?username=${encodeURIComponent(username)}`, {
    headers: getAuthHeader(),
  });
  if (!res.ok) throw await toApiError(res, "Failed to fetch tweets");
  return res.json();
}
