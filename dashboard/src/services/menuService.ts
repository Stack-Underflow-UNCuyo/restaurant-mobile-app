import { apiClient } from "@/lib/apiClient";
import type { Menu } from "@/types/entities";


export type DetalleMenuPayload = {
  nombre: string;
  cantidad: number;
  articuloId: string;
  articuloCantidad?: number;
};

export type MenuPayload = {
  nombre: string;
  descripcion?: string;
  precio: number;
  detallesMenu?: DetalleMenuPayload[];
  imagen?: { nombre: string; mime: string; contenido: string; tipoImagen: string };
};


export const menuService = {
  getAll: () => apiClient.get<Menu[]>("/api/v1/menus"),
  create: (data: MenuPayload) => apiClient.post<Menu>("/api/v1/menus", data),
  update: (id: string, data: MenuPayload) => apiClient.put<Menu>(`/api/v1/menus/${id}`, data),
  remove: (id: string) => apiClient.del(`/api/v1/menus/${id}`),
};
