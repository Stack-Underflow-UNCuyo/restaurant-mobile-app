import { apiClient } from "@/lib/apiClient";
import type { MesaRestaurante } from "@/types/mesaRestaurante";

export const mesaRestauranteService = {
  getAll: () => apiClient.get<MesaRestaurante[]>("/api/v1/mesas"),
  create: (data: Omit<MesaRestaurante, "id">) =>
    apiClient.post<MesaRestaurante>("/api/v1/mesas", data),
  update: (id: string, data: Omit<MesaRestaurante, "id">) =>
    apiClient.put<MesaRestaurante>(`/api/v1/mesas/${id}`, data),
  remove: (id: string) => apiClient.del(`/api/v1/mesas/${id}`),
};
