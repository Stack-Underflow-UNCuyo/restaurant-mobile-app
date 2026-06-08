import { apiClient } from "@/lib/apiClient";
import type { DetalleFactura } from "@/types/factura";

export type DetalleFacturaPayload = {
    cantidad: number;
    subtotal: number;
    detalleComandaId: string; // debe coincidir con el campo del DetalleFacturaCreateDto del backend
};

export const detalleFacturaService = {
    getAll: () => apiClient.get<DetalleFactura[]>("/api/v1/detalles-factura"),
    create: (data: DetalleFacturaPayload) => apiClient.post<DetalleFactura>("/api/v1/detalles-factura", data),
    update: (id: string, data: DetalleFacturaPayload) => apiClient.put<DetalleFactura>(`/api/v1/detalles-factura/${id}`, data),
    remove: (id: string) => apiClient.del(`/api/v1/detalles-factura/${id}`),
};
