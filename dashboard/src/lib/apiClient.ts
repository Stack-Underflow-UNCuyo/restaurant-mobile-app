//automatiza las peticiones a Spring
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8081";

function getToken(): string | null {
  if (typeof document === "undefined") return null;
  return (
    document.cookie
      .split("; ")
      .find((r) => r.startsWith("auth-token="))
      ?.split("=")[1] ?? null
  );
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const body = await res.text();
    console.error("API error:", res.status, body);
    throw new Error(`${res.status} ${res.statusText}`);
  }
  // 204 No Content has no body
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const apiClient = {
  get:  <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put:  <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  del:  (path: string) => request<void>(path, { method: "DELETE" }),
};
