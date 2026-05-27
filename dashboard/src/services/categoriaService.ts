import { apiClient } from "@/lib/apiClient";
import type { Categoria } from "@/types/entities";

type CategoriaPayload = { nombre: string };

export const categoriaService = {
  getAll: () => apiClient.get<Categoria[]>("/api/v1/categorias"),
  create: (data: CategoriaPayload) => apiClient.post<Categoria>("/api/v1/categorias", data),
  update: (id: number, data: CategoriaPayload) => apiClient.put<Categoria>(`/api/v1/categorias/${id}`, data),
  remove: (id: number) => apiClient.del(`/api/v1/categorias/${id}`),
};
