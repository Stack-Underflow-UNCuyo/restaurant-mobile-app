import { apiClient } from "@/lib/apiClient";
import type { MovimientoStock } from "@/types/entities";

interface MovimientoStockPayload {
  cantidad: number;
  tipoMovimientoStock: string;
  stockId: string;
}

export const movimientoStockService = {
  getAll: () => apiClient.get<MovimientoStock[]>("/api/v1/movimientos-stock"),
  create: (data: MovimientoStockPayload) => apiClient.post<MovimientoStock>("/api/v1/movimientos-stock", data),
  update: (id: string, data: MovimientoStockPayload) => apiClient.put<MovimientoStock>(`/api/v1/movimientos-stock/${id}`, data),
  remove: (id: string) => apiClient.del(`/api/v1/movimientos-stock/${id}`),
  getAllByArticuloId: (articuloId: number) => apiClient.get<MovimientoStock[]>(`/api/v1/movimientos-stock/articulo/${articuloId}`),
};
