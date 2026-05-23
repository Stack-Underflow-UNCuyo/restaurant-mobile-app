import { apiClient } from "@/lib/apiClient";
import type { UnidadDeMedida } from "@/types/entities";

export const unidadDeMedidaService = {
  getAll: () => apiClient.get<UnidadDeMedida[]>("/api/v1/unidades-de-medida"),
  create: (data: Omit<UnidadDeMedida, "id">) => apiClient.post<UnidadDeMedida>("/api/v1/unidades-de-medida", data),
  update: (id: number, data: Omit<UnidadDeMedida, "id">) => apiClient.put<UnidadDeMedida>(`/api/v1/unidades-de-medida/${id}`, data),
  remove: (id: number) => apiClient.del(`/api/v1/unidades-de-medida/${id}`),
};
