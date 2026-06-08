import { apiFetch } from "@/lib/apiClient";
import type { DetalleComanda, EstadoDetalleComanda } from "@/types/comanda";

const BASE = "/api/v1/comandas-restaurant";

export interface UpdateEstadoPayload {
  cantidad: number;
  estadoDetalleComanda: EstadoDetalleComanda;
  comandaId: string;
  detalleSeccionCartaId: string;
}

export function updateEstadoDetalle(
  token: string,
  comandaId: string,
  detalleId: string,
  payload: UpdateEstadoPayload,
): Promise<DetalleComanda> {
  return apiFetch<DetalleComanda>(`${BASE}/${comandaId}/detalles/${detalleId}`, {
    token,
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
