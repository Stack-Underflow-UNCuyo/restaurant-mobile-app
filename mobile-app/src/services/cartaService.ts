/**
 * Llamadas al backend para las cartas (menús) del restaurante.
 * Endpoints (BaseController en /api/v1/cartas) — datos públicos de la carta
 * digital, igual que carta-web/src/services/cartaService.ts (sin token):
 *  - GET /api/v1/cartas      -> lista de cartas
 *  - GET /api/v1/cartas/{id} -> detalle de una carta (con sus secciones)
 */
import { apiFetch } from "@/lib/apiClient";
import type { Carta } from "@/types/carta";

export function getCartas(): Promise<Carta[]> {
  return apiFetch<Carta[]>("/api/v1/cartas");
}

export function getCartaById(id: string): Promise<Carta> {
  return apiFetch<Carta>(`/api/v1/cartas/${id}`);
}
