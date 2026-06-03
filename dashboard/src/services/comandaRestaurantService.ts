import { apiClient } from "@/lib/apiClient";
import type { ComandaRestaurantDto } from "@/types/comanda";

export type ComandaRestaurantPayload = {
  fechaSolicitudComanda?: string | null;
  fechaEntregaComanda?: string | null;
  estadoComanda?: string;
  clienteId?: string;
  empleadoId: string;
};

export const comandaRestaurantService = {
  getAll: () => apiClient.get<ComandaRestaurantDto[]>("/api/v1/comandas-restaurant"),
  create: (data: ComandaRestaurantPayload) =>
    apiClient.post<ComandaRestaurantDto>("/api/v1/comandas-restaurant", data),
  update: (id: string, data: ComandaRestaurantPayload) =>
    apiClient.put<ComandaRestaurantDto>(`/api/v1/comandas-restaurant/${id}`, data),
  remove: (id: string) => apiClient.del(`/api/v1/comandas-restaurant/${id}`),
};
