/**
 * Llamadas al backend para las mesas del restaurante.
 * Endpoints (BaseController en /api/v1/mesas):
 *  - GET  /api/v1/mesas        -> lista de mesas
 *  - PUT  /api/v1/mesas/{id}   -> actualiza la mesa (requiere el objeto COMPLETO)
 */
import { apiFetch } from "@/lib/apiClient";
import type { EstadoMesa, Mesa } from "@/types/mesa";

/** Trae todas las mesas, ordenadas por su identificador para un orden estable. */
export async function getMesas(token: string): Promise<Mesa[]> {
  const mesas = await apiFetch<Mesa[]>("/api/v1/mesas", { token });
  return [...mesas].sort((a, b) => a.identificadorMesa - b.identificadorMesa);
}

/**
 * Cambia el estado de una mesa. El PUT del backend no acepta parciales, así que
 * reenviamos el objeto completo (identificador, capacidad, zona) con el nuevo estado.
 */
export async function updateEstadoMesa(
  token: string,
  mesa: Mesa,
  estado: EstadoMesa,
): Promise<Mesa> {
  return apiFetch<Mesa>(`/api/v1/mesas/${mesa.id}`, {
    method: "PUT",
    token,
    body: JSON.stringify({
      identificadorMesa: mesa.identificadorMesa,
      estadoMesa: estado,
      capacidadPersonas: mesa.capacidadPersonas,
      zonaFisica: mesa.zonaFisica,
    }),
  });
}
