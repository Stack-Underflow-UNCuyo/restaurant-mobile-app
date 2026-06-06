import { apiClient } from "@/lib/apiClient";
import type { Categoria } from "@/types/entities";

type CategoriaPayload = { nombre: string };

export const categoriaService = {
  getAll: () => apiClient.get<Categoria[]>("/api/v1/categorias"),
  create: (data: CategoriaPayload) => apiClient.post<Categoria>("/api/v1/categorias", data),
  update: (id: string, data: CategoriaPayload) => apiClient.put<Categoria>(`/api/v1/categorias/${id}`, data),
  remove: (id: string) => apiClient.del(`/api/v1/categorias/${id}`),
};
