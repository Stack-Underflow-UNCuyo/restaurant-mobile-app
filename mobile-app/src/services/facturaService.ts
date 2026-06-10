/**
 * Llamadas al backend para facturas (cobro desde la app del mozo).
 * Endpoint:
 *  - POST /api/v1/facturas/cobrar -> genera la factura PAGADA, finaliza la
 *    comanda y libera la mesa.
 */
import { apiFetch } from "@/lib/apiClient";

export type TipoPago = "EFECTIVO" | "TRANSFERENCIA" | "BILLETERA_VIRTUAL";

export interface CobrarPayload {
  comandaId: string;
  tipoPago: TipoPago;
  promocionId?: string;
}

/** Respuesta mínima de la factura generada. */
export interface FacturaResp {
  id: string;
  numeroFactura: number;
  totalPagado: number;
}

/** Cobra una comanda generando la factura con el medio de pago indicado. */
export function cobrar(token: string, payload: CobrarPayload): Promise<FacturaResp> {
  return apiFetch<FacturaResp>("/api/v1/facturas/cobrar", {
    token,
    method: "POST",
    body: JSON.stringify(payload),
  });
}
