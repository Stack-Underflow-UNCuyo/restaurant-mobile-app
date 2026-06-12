import { apiClient } from "@/lib/apiClient";
import type { DetalleMenu } from "@/types/entities";

export type DetalleMenuPayload = { nombre: string; cantidad: number; articuloId: string };

export const detalleMenuService = {
  getAll: () => apiClient.get<DetalleMenu[]>("/api/v1/detalles-menu"),
  create: (data: DetalleMenuPayload) => apiClient.post<DetalleMenu>("/api/v1/detalles-menu", data),
  update: (id: string, data: DetalleMenuPayload) => apiClient.put<DetalleMenu>(`/api/v1/detalles-menu/${id}`, data),
  remove: (id: string) => apiClient.del(`/api/v1/detalles-menu/${id}`),

  getByMenuId: (menuId: string) =>
    apiClient.get<DetalleMenu[]>(`/api/v1/menus/${menuId}/detalles-menu`),
  createInMenu: (menuId: string, data: DetalleMenuPayload) =>
    apiClient.post<DetalleMenu>(`/api/v1/menus/${menuId}/detalles-menu`, data),
  updateInMenu: (menuId: string, detalleId: string, data: DetalleMenuPayload) =>
    apiClient.put<DetalleMenu>(`/api/v1/menus/${menuId}/detalles-menu/${detalleId}`, data),
  removeFromMenu: (menuId: string, detalleId: string) =>
    apiClient.del(`/api/v1/menus/${menuId}/detalles-menu/${detalleId}`),
};
