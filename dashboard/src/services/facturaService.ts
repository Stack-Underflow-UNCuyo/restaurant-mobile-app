import { apiClient } from "@/lib/apiClient";
import type { Factura } from "@/types/factura";

export type FacturaPayload = {
    numeroFactura: number;
    fechaFactura: string;
    totalPagado: number;
    estado: string;
    formaDePagoId: string;
    promocionId?: string;
    detalleFacturaIds: string[];
};

// Generar factura a partir de una comanda
export type GenerarFacturaPayload = {
    comandaId: string;
    formaDePagoId: string;
    promocionId?: string;
    fechaFactura: string;
    estado: string;
};

export type LineaFacturaPreview = {
    detalleComandaId: string;
    nombreItem: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
};

export type FacturaPreview = {
    lineas: LineaFacturaPreview[];
    subtotalGeneral: number;
    descuento: number;
    total: number;
    yaFacturada: boolean;
};

export const facturaService = {
    getAll: () => apiClient.get<Factura[]>("/api/v1/facturas"),
    create: (data: FacturaPayload) => apiClient.post<Factura>("/api/v1/facturas", data),
    update: (id: string, data: FacturaPayload) => apiClient.put<Factura>(`/api/v1/facturas/${id}`, data),
    remove: (id: string) => apiClient.del(`/api/v1/facturas/${id}`),
    previewDesdeComanda: (comandaId: string) =>
        apiClient.get<FacturaPreview>(`/api/v1/facturas/preview?comandaId=${encodeURIComponent(comandaId)}`),
    generarDesdeComanda: (data: GenerarFacturaPayload) =>
        apiClient.post<Factura>("/api/v1/facturas/generar-desde-comanda", data),
};
