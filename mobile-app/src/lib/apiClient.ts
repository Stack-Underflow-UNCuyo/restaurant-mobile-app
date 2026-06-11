/**
 * Cliente HTTP fino sobre fetch. Adjunta el JWT como Bearer cuando se le pasa
 * un token y normaliza los errores que devuelve el backend Spring.
 * Toda llamada al backend debe pasar por acá — nada de fetch suelto en pantallas.
 */
import { API_URL } from "@/views/constants/config";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

interface RequestOptions extends RequestInit {
  /** JWT a adjuntar en el header Authorization. */
  token?: string | null;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers, ...init } = options;

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });
  } catch {
    throw new ApiError(
      "No se pudo conectar con el servidor. Verificá tu conexión y la URL del backend.",
      0,
    );
  }

  if (!res.ok) {
    let message = `Error ${res.status}`;
    try {
      const body = await res.json();
      if (typeof body?.details === "string" && body.details.trim()) message = body.details;
      else if (typeof body?.message === "string" && body.message.trim()) message = body.message;
      else if (typeof body?.error === "string" && body.error.trim()) message = body.error;
    } catch {
      // se mantiene el mensaje genérico
    }
    throw new ApiError(message, res.status);
  }

  // Algunos endpoints (ej DELETE) pueden no devolver cuerpo.
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
