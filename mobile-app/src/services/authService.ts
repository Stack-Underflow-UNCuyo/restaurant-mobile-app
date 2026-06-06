/**
 * Lógica de autenticación contra el backend Spring.
 *
 * Flujo de login:
 *  1. POST /auth/login { email, clave }  -> { accessToken }
 *  2. Decodificar el JWT para obtener id de usuario, email y roles.
 *  3. GET /api/v1/usuarios/{id}          -> personaId del usuario.
 *  4. GET /api/v1/empleados/{personaId}  -> tipoEmpleado (MOZO / COCINERO) + nombre.
 *
 * El tipo de empleado no viaja en el token, por eso los pasos 3 y 4.
 */
import { apiFetch, ApiError } from "@/lib/apiClient";
import type { AuthUser, JwtClaims, LoginResponse, TipoEmpleado } from "@/types/auth";

/** Decodifica el payload de un JWT sin verificar la firma (eso lo hace el server). */
export function decodeJwt(token: string): JwtClaims | null {
  try {
    const payload = token.split(".")[1];
    // base64url -> base64
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeBase64(base64);
    return JSON.parse(json) as JwtClaims;
  } catch {
    return null;
  }
}

/** Indica si un token está vencido (con 10s de margen). */
export function isTokenExpired(token: string): boolean {
  const claims = decodeJwt(token);
  if (!claims?.exp) return true;
  return Date.now() / 1000 >= claims.exp - 10;
}

interface UsuarioDto {
  id: string;
  email: string;
  personaId: string | null;
}

interface EmpleadoDto {
  id: string;
  nombre: string;
  apellido: string;
  tipoEmpleado: TipoEmpleado | "ADMINISTRATIVO";
}

/**
 * Resuelve el perfil completo del empleado a partir de un token válido.
 * Lanza ApiError si el usuario no es MOZO ni COCINERO.
 */
export async function resolveAuthUser(token: string): Promise<AuthUser> {
  const claims = decodeJwt(token);
  if (!claims) throw new ApiError("Token inválido.", 401);

  const usuario = await apiFetch<UsuarioDto>(`/api/v1/usuarios/${claims.sub}`, { token });
  if (!usuario.personaId) {
    throw new ApiError("Tu cuenta no tiene un empleado asociado.", 403);
  }

  const empleado = await apiFetch<EmpleadoDto>(`/api/v1/empleados/${usuario.personaId}`, { token });

  if (empleado.tipoEmpleado !== "MOZO" && empleado.tipoEmpleado !== "COCINERO") {
    throw new ApiError("Esta aplicación es solo para mozos y cocineros.", 403);
  }

  return {
    id: claims.sub,
    email: claims.e ?? usuario.email,
    roles: claims.a ?? [],
    tipoEmpleado: empleado.tipoEmpleado,
    nombre: empleado.nombre ?? "",
    apellido: empleado.apellido ?? "",
  };
}

/** Hace login y devuelve el token + el usuario resuelto. */
export async function login(
  email: string,
  clave: string,
): Promise<{ token: string; user: AuthUser }> {
  const { accessToken } = await apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, clave }),
  });

  const user = await resolveAuthUser(accessToken);
  return { token: accessToken, user };
}

/** Decodifica base64 en entornos RN/web (atob no siempre está disponible). */
function decodeBase64(input: string): string {
  if (typeof atob === "function") return atob(input);
  // Fallback con Buffer (presente en algunos runtimes vía polyfills).
  const maybeBuffer = (
    globalThis as {
      Buffer?: { from(data: string, encoding: string): { toString(encoding: string): string } };
    }
  ).Buffer;
  return maybeBuffer
    ? maybeBuffer.from(input, "base64").toString("binary")
    : decodeBase64Manual(input);
}

/** Decodificador base64 puro por si no hay atob ni Buffer. */
function decodeBase64Manual(input: string): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  let output = "";
  const clean = input.replace(/=+$/, "");
  for (let bc = 0, bs = 0, i = 0; i < clean.length; i++) {
    const buffer = chars.indexOf(clean[i]);
    if (buffer === -1) continue;
    bs = bc % 4 ? bs * 64 + buffer : buffer;
    if (bc++ % 4) {
      output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6)));
    }
  }
  return output;
}
