import { apiClient } from "@/lib/apiClient";
import type { DetalleComanda } from "@/types/detalleComanda";

export const detalleComandaService = {
  getAll: (comandaId: string) =>
    apiClient.get<DetalleComanda[]>(`/api/v1/comandas/${encodeURIComponent(comandaId)}/detalles`),
  create: (comandaId: string, data: Omit<DetalleComanda, "id">) =>
    apiClient.post<DetalleComanda>(`/api/v1/comandas/${encodeURIComponent(comandaId)}/detalles`, data),
  update: (comandaId: string, detalleId: string, data: Omit<DetalleComanda, "id">) =>
    apiClient.put<DetalleComanda>(
      `/api/v1/comandas/${encodeURIComponent(comandaId)}/detalles/${encodeURIComponent(detalleId)}`,
      data,
    ),
  remove: (comandaId: string, detalleId: string) =>
    apiClient.del(
      `/api/v1/comandas/${encodeURIComponent(comandaId)}/detalles/${encodeURIComponent(detalleId)}`,
    ),
};
