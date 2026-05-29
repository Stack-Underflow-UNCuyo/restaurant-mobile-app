import type { FormaDePago } from "./formaDePago";
import type { Promocion } from "./promocion";

export enum EstadoFactura {
    PAGADA = "PAGADA",
    ANULADA = "ANULADA",
    SIN_DEFINIR = "SIN_DEFINIR",
}

export interface Factura {
    id: string;
    numeroFactura: number;
    fechaFactura: string; 
    totalPagado: number;
    estado: EstadoFactura;
    formaDePago: FormaDePago | null;
    promocion: Promocion | null;
}

// detalleComanda se ignora por ahora
export interface DetalleFactura {
    id: string;
    cantidad: number;
    subtotal: number;
    factura: Factura | null;
}
