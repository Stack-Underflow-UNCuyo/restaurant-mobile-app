const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8081";

export class ApiError extends Error {
  public status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!res.ok) {
    // parsear el ErrorMessage que devuelve GlobalExceptionHandler
    let message = `${res.status} ${res.statusText}`;

    try {
      const body = await res.json();
      if (typeof body.details === "string" && body.details.trim()) {
        message = body.details;
      } else if (typeof body.message === "string" && body.message.trim()) {
        message = body.message;
      }
    } catch {
      // dejamos el mensaje genérico de arriba
    }

    throw new ApiError(message, res.status);
  }
  // 204 No Content has no body
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
};
