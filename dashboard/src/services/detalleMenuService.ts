import { apiClient } from "@/lib/apiClient";
import type { DetalleMenu } from "@/types/entities";

type DetalleMenuPayload = { nombre: string; cantidad: number;  articuloId: string };

export const detalleMenuService = {
  getAll: () => apiClient.get<DetalleMenu[]>("/api/v1/detalles-menu"),
  create: (data: DetalleMenuPayload) => apiClient.post<DetalleMenu>("/api/v1/detalles-menu", data),
  update: (id: number, data: DetalleMenuPayload) => apiClient.put<DetalleMenu>(`/api/v1/detalles-menu/${id}`, data),
  remove: (id: number) => apiClient.del(`/api/v1/detalles-menu/${id}`),
};
