import { apiClient } from "@/lib/apiClient";
import type { Pais } from "@/types/entities";

export const paisService = {
  getAll: () => apiClient.get<Pais[]>("/api/v1/paises"),
  create: (data: Omit<Pais, "id">) => apiClient.post<Pais>("/api/v1/paises", data),
  update: (id: number, data: Omit<Pais, "id">) => apiClient.put<Pais>(`/api/v1/paises/${id}`, data),
  remove: (id: number) => apiClient.del(`/api/v1/paises/${id}`),
};
