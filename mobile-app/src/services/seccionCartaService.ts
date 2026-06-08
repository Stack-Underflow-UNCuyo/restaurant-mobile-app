/**
 * Llamadas al backend para las secciones de una carta.
 * Endpoint (BaseController en /api/v1/secciones-carta) — datos públicos,
 * igual que carta-web/src/services/seccionCartaService.ts (sin token):
 *  - GET /api/v1/secciones-carta/{id} -> detalle de una sección (con sus platos)
 */
import { apiFetch } from "@/lib/apiClient";
import type { SeccionCarta } from "@/types/carta";

export function getSeccionCartaById(id: string): Promise<SeccionCarta> {
  return apiFetch<SeccionCarta>(`/api/v1/secciones-carta/${id}`);
}
