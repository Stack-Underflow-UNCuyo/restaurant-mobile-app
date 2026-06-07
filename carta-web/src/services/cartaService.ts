import { apiClient } from "@/lib/apiClient";
import type { Carta } from "@/types/entities";

export const cartaService = {
  getAll: () => apiClient.get<Carta[]>("/api/v1/cartas"),
  getById: (id: string) => apiClient.get<Carta>(`/api/v1/cartas/${id}`),
};
