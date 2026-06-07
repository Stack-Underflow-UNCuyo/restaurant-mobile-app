import { apiClient } from "@/lib/apiClient";
import type { Carta } from "@/types/entities";

type CartaPayload = {
  nombre?: string;
  seccionCartaIds?: string[];
  fechaDesde: string;
  fechaHasta: string;
};

export const cartaService = {
  getAll: () => apiClient.get<Carta[]>("/api/v1/cartas"),
  getAllIncludingDeleted: () => apiClient.get<Carta[]>("/api/v1/cartas/todos"),
  getById: (id: string) => apiClient.get<Carta>(`/api/v1/cartas/${id}`),
  create: (data: CartaPayload) => apiClient.post<Carta>("/api/v1/cartas", data),
  update: (id: string, data: CartaPayload) => apiClient.put<Carta>(`/api/v1/cartas/${id}`, data),
  remove: (id: string) => apiClient.del(`/api/v1/cartas/${id}`),
};
