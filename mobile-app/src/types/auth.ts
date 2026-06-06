/**
 * Tipos del dominio de autenticación, alineados con el backend Spring.
 * El JWT trae los claims: sub (id usuario), e (email), a (roles ROLE_*).
 * El tipo de empleado (MOZO / COCINERO) NO viaja en el token: se resuelve
 * consultando el usuario y su empleado asociado tras el login.
 */

/** Roles de empleado soportados por la app móvil. */
export type TipoEmpleado = "MOZO" | "COCINERO";

/** Respuesta de POST /auth/login. */
export interface LoginResponse {
  accessToken: string;
}

/** Claims decodificados del JWT. */
export interface JwtClaims {
  /** id del usuario */
  sub: string;
  /** email */
  e: string;
  /** roles, ej ["ROLE_PERSONAL"] */
  a: string[];
  /** expiración (epoch segundos) */
  exp: number;
}

/** Usuario autenticado tal como lo expone la app. */
export interface AuthUser {
  id: string;
  email: string;
  roles: string[];
  tipoEmpleado: TipoEmpleado;
  nombre: string;
  apellido: string;
}
