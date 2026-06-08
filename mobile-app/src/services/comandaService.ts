/**
 * Llamadas al backend para las comandas del restaurante.
 * Endpoints (ComandaRestaurantController en /api/v1/comandas-restaurant):
 *  - GET /api/v1/comandas-restaurant            -> todas las comandas
 *  - GET /api/v1/comandas-restaurant/mesa/{id}  -> comandas de una mesa
 *  - GET /api/v1/comandas-restaurant/{id}/detalles -> líneas de pedido de una comanda
 */
import { apiFetch } from "@/lib/apiClient";
import type { Comanda, DetalleComanda } from "@/types/comanda";

const BASE = "/api/v1/comandas-restaurant";

/** Trae todas las comandas, de más reciente a más antigua. */
export async function getComandas(token: string): Promise<Comanda[]> {
  const comandas = await apiFetch<Comanda[]>(BASE, { token });
  return ordenarPorFecha(comandas);
}

/** Trae las comandas de una mesa puntual, de más reciente a más antigua. */
export async function getComandasPorMesa(token: string, mesaId: string): Promise<Comanda[]> {
  const comandas = await apiFetch<Comanda[]>(`${BASE}/mesa/${mesaId}`, { token });
  return ordenarPorFecha(comandas);
}

/** Trae las líneas de pedido (detalles) de una comanda. */
export function getDetallesComanda(token: string, comandaId: string): Promise<DetalleComanda[]> {
  return apiFetch<DetalleComanda[]>(`${BASE}/${comandaId}/detalles`, { token });
}

function ordenarPorFecha(comandas: Comanda[]): Comanda[] {
  return [...comandas].sort((a, b) => b.fechaSolicitudComanda.localeCompare(a.fechaSolicitudComanda));
}
