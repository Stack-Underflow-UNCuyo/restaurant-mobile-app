import { apiClient } from "@/lib/apiClient";
import type { Stock } from "@/types/entities";

interface StockPayload {
  articuloId: string;
  cantidadActual: number;
  minimo: number;
}

export const stockService = {
  getAll: () => apiClient.get<Stock[]>("/api/v1/stocks"),
  create: (data: StockPayload) => apiClient.post<Stock>("/api/v1/stocks", data),
  update: (id: number, data: StockPayload) => apiClient.put<Stock>(`/api/v1/stocks/${id}`, data),
  remove: (id: number) => apiClient.del(`/api/v1/stocks/${id}`),
  getAllByArticuloId: (articuloId: number) => apiClient.get<Stock[]>(`/api/v1/stocks/articulo/${articuloId}`),
};