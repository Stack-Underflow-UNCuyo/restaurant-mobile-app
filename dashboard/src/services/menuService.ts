import { apiClient } from "@/lib/apiClient";
import type { Articulo, Menu } from "@/types/entities";

export type MenuDetallePayload = { cantidad: number; articulo: Articulo };
export type MenuPayload = { nombre: string; precio: number; detallesMenu: MenuDetallePayload[] };

export const menuService = {
  getAll: () => apiClient.get<Menu[]>("/api/v1/menus"),
  create: (data: MenuPayload) => apiClient.post<Menu>("/api/v1/menus", data),
  update: (id: number, data: MenuPayload) => apiClient.put<Menu>(`/api/v1/menus/${id}`, data),
  remove: (id: number) => apiClient.del(`/api/v1/menus/${id}`),
};
