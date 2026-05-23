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

export class ApiError extends Error {
  public status: number;
  //Solo presente en errores de validación: campo - mensaje
  public fieldErrors?: Record<string, string>;

  constructor(message: string, status: number, fieldErrors?: Record<string, string>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
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
    // parsear el ErrorMessage que devuelve GlobalExceptionHandler
    let message = `${res.status} ${res.statusText}`;
    let fieldErrors: Record<string, string> | undefined;

    try {
      const body = await res.json();
      // body.message :descripción general
      // body.details: string (excepción genérica) o Record<string,string> (validación)
      if (typeof body.details === "string" && body.details.trim()) {
        message = body.details;
      } else if (typeof body.message === "string" && body.message.trim()) {
        message = body.message;
      }
      if (typeof body.details === "object" && body.details !== null) {
        fieldErrors = body.details as Record<string, string>;
      }
    } catch {
      // dejamos el mensaje genérico de arriba
    }

    console.error("API error:", res.status, message, fieldErrors);
    throw new ApiError(message, res.status, fieldErrors);
  
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
