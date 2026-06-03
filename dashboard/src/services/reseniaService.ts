import { apiClient } from "@/lib/apiClient";
import type { Resenia } from "@/types/resenia";

type ReseniaPayload = {
  observacion: string;
};

export const reseniaService = {
  getAll: () => apiClient.get<Resenia[]>("/api/v1/resenias"),
  create: (data: ReseniaPayload) =>
    apiClient.post<Resenia>("/api/v1/resenias", data),
  update: (id: string, data: ReseniaPayload) =>
    apiClient.put<Resenia>(`/api/v1/resenias/${id}`, data),
  remove: (id: string) => apiClient.del(`/api/v1/resenias/${id}`),
  getByComanda: (comandaId: string) =>
    apiClient.get<Resenia[]>(`/api/v1/comandas/${encodeURIComponent(comandaId)}/resenias`),
  createForComanda: (comandaId: string, data: ReseniaPayload) =>
    apiClient.post<Resenia>(`/api/v1/comandas/${encodeURIComponent(comandaId)}/resenias`, data),
  updateForComanda: (comandaId: string, reseniaId: string, data: ReseniaPayload) =>
    apiClient.put<Resenia>(
      `/api/v1/comandas/${encodeURIComponent(comandaId)}/resenias/${encodeURIComponent(reseniaId)}`,
      data,
    ),
  removeForComanda: (comandaId: string, reseniaId: string) =>
    apiClient.del(
      `/api/v1/comandas/${encodeURIComponent(comandaId)}/resenias/${encodeURIComponent(reseniaId)}`,
    ),
};
