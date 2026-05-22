import { apiClient } from "@/lib/apiClient";
import type { MovimientoStock } from "@/types/entities";

export const movimientoStockService = {
  getAll: () => apiClient.get<MovimientoStock[]>("/api/v1/movimientos-stock"),
  create: (data: Omit<MovimientoStock, "id">) => apiClient.post<MovimientoStock>("/api/v1/movimientos-stock", data),
  update: (id: number, data: Omit<MovimientoStock, "id">) => apiClient.put<MovimientoStock>(`/api/v1/movimientos-stock/${id}`, data),
  remove: (id: number) => apiClient.del(`/api/v1/movimientos-stock/${id}`),
  getAllByArticuloId: (articuloId: number) => apiClient.get<MovimientoStock[]>(`/api/v1/movimientos-stock/articulo/${articuloId}`),
};
