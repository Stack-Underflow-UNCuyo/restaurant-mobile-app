/**
 * Llamadas al backend para crear resenia
 * Endpoint (BaseController en /api/v1/secciones-carta/resenia) — datos públicos,
 * igual que carta-web/src/services/seccionCartaService.ts (sin token):
 *  - GET /api/v1/secciones-carta/{id} -> detalle de una sección (con sus platos)
 */
import { apiFetch } from "@/lib/apiClient";
import type { Resenia } from "@/types/carta";

export function createResenia(token: string, resenia: Resenia, comandaId: string): Promise<Resenia> {
  return apiFetch<Resenia>(`/api/v1/comandas/${comandaId}/resenias`, {
    token,
    method: "POST",
    body: JSON.stringify(resenia),
  });
}