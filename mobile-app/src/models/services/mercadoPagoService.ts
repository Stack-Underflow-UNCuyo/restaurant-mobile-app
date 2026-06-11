/**
 * Llamadas al backend para Mercado Pago.
 * Endpoint:
 *  - POST /api/v1/mercadopago/orders -> crea una order de cobro (QR dinámico)
 */
import { apiFetch } from "@/lib/apiClient";
import type { EstadoOrden, OrdenMP } from "@/models/types/orden";

export interface CrearOrdenPayload {
  amount: number;
  description?: string;
  comandaId?: string;
  promocionId?: string;
  cajaExternalId?: string;
}

/** Crea una order de cobro por QR y devuelve el qrData a renderizar. */
export function crearOrden(token: string, payload: CrearOrdenPayload): Promise<OrdenMP> {
  return apiFetch<OrdenMP>("/api/v1/mercadopago/orders", {
    token,
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** Consulta el estado de pago de una order (polling). Si está pagada, el backend ya generó la factura. */
export function confirmarPago(token: string, ordenId: string): Promise<EstadoOrden> {
  return apiFetch<EstadoOrden>(`/api/v1/mercadopago/orders/${ordenId}/confirmar-pago`, {
    token,
    method: "POST",
  });
}
