import { apiClient } from "@/lib/apiClient";
import type { Articulo } from "@/types/entities";

type ArticuloPayload = {
  nombre: string;
  descripcion?: string;
  sinTAC: boolean;
  esIngrediente: boolean;
  unidadDeMedidaId: string;
};

export const articuloService = {
  getAll: () => apiClient.get<Articulo[]>("/api/v1/articulos"),
  create: (data: ArticuloPayload) => apiClient.post<Articulo>("/api/v1/articulos", data),
  update: (id: string, data: ArticuloPayload) => apiClient.put<Articulo>(`/api/v1/articulos/${id}`, data),
  remove: (id: string) => apiClient.del(`/api/v1/articulos/${id}`),
  getByNombre: (nombre: string) => apiClient.get<Articulo>(`/api/v1/articulos/nombre/${encodeURIComponent(nombre)}`),
};
