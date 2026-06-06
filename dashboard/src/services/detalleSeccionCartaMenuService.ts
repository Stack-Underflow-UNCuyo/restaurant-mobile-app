import { apiClient } from "@/lib/apiClient";
import type { DetalleSeccionCartaMenu } from "@/types/entities";

type DetalleSeccionCartaMenuPayload = { seccionCartaId: string; menuId: string };

export const detalleSeccionCartaMenuService = {
  getAll: () => apiClient.get<DetalleSeccionCartaMenu[]>("/api/v1/detalles-seccion-carta-menu"),
  create: (data: DetalleSeccionCartaMenuPayload) => apiClient.post<DetalleSeccionCartaMenu>("/api/v1/detalles-seccion-carta-menu", data),
  update: (id: string, data: DetalleSeccionCartaMenuPayload) => apiClient.put<DetalleSeccionCartaMenu>(`/api/v1/detalles-seccion-carta-menu/${id}`, data),
  remove: (id: string) => apiClient.del(`/api/v1/detalles-seccion-carta-menu/${id}`),
};
