/**
 * Llamadas al backend para las promociones.
 * Endpoint (PromocionController en /api/v1/promociones):
 *  - GET /api/v1/promociones -> todas las promociones
 */
import { apiFetch } from "@/lib/apiClient";
import type { Promocion } from "@/models/types/promocion";

const BASE = "/api/v1/promociones";

/** Trae todas las promociones disponibles para aplicar al pago. */
export function getPromociones(token: string): Promise<Promocion[]> {
  return apiFetch<Promocion[]>(BASE, { token });
}
