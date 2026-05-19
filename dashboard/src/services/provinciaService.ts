import { apiClient } from "@/lib/apiClient";
import type { Provincia } from "@/types/entities";

type ProvinciaPayload = { nombre: string; paisId: string };

export const provinciaService = {
  getAll: () => apiClient.get<Provincia[]>("/api/v1/provincias"),
  create: (data: ProvinciaPayload) => apiClient.post<Provincia>("/api/v1/provincias", data),
  update: (id: number, data: ProvinciaPayload) => apiClient.put<Provincia>(`/api/v1/provincias/${id}`, data),
  remove: (id: number) => apiClient.del(`/api/v1/provincias/${id}`),
};
