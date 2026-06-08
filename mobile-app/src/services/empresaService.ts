/**
 * Llamadas al backend para los datos de la empresa.
 * Endpoint (BaseController en /api/v1/empresa):
 *  - GET /api/v1/empresa -> empresa activa (público, no requiere token)
 */
import { apiFetch } from "@/lib/apiClient";
import type { Empresa } from "@/types/empresa";

export function getEmpresaActiva(): Promise<Empresa> {
  return apiFetch<Empresa>("/api/v1/empresa");
}
