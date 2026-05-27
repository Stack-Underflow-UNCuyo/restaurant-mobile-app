import { apiClient } from "@/lib/apiClient";
import type { Carta } from "@/types/entities";

type CartaPayload = { seccionCartaId: string; fechaDesde: string; fechaHasta: string };

export const cartaService = {
  getAll: () => apiClient.get<Carta[]>("/api/v1/cartas"),
  create: (data: CartaPayload) => apiClient.post<Carta>("/api/v1/cartas", data),
  update: (id: number, data: CartaPayload) => apiClient.put<Carta>(`/api/v1/cartas/${id}`, data),
  remove: (id: number) => apiClient.del(`/api/v1/cartas/${id}`),
};
