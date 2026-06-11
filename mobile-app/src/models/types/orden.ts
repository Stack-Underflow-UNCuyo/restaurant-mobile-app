/**
 * Order de cobro por QR de Mercado Pago, espejo de OrdenDto del backend.
 * `qrData` es el contenido EMVCo a renderizar como QR (no es una URL).
 */
export interface OrdenMP {
  id: string;
  orderId: string;
  paymentId: string | null;
  status: string;
  statusDetail: string | null;
  amount: number;
  externalReference: string;
  mode: string;
  qrData: string | null;
  comandaId: string | null;
  cajaExternalId: string | null;
}

/** Estado de una order consultado en el polling de pago. */
export interface EstadoOrden {
  status: string;
  paid: boolean;
}
