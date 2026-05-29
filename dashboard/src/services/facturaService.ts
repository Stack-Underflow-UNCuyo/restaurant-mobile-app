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

export const facturaService = {
    getAll: () => apiClient.get<Factura[]>("/api/v1/facturas"),
    create: (data: FacturaPayload) => apiClient.post<Factura>("/api/v1/facturas", data),
    update: (id: string, data: FacturaPayload) => apiClient.put<Factura>(`/api/v1/facturas/${id}`, data),
    remove: (id: string) => apiClient.del(`/api/v1/facturas/${id}`),
};
