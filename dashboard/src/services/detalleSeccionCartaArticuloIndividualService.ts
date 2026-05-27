import { apiClient } from "@/lib/apiClient";
import type { Articulo, DetalleSeccionCartaArticuloIndividual } from "@/types/entities";

type DetalleSeccionCartaArticuloPayload = { precio: number; articulos: Articulo[] };

export const detalleSeccionCartaArticuloIndividualService = {
  getAll: () => apiClient.get<DetalleSeccionCartaArticuloIndividual[]>("/api/v1/detalles-seccion-carta-articulo"),
  create: (data: DetalleSeccionCartaArticuloPayload) => apiClient.post<DetalleSeccionCartaArticuloIndividual>("/api/v1/detalles-seccion-carta-articulo", data),
  update: (id: number, data: DetalleSeccionCartaArticuloPayload) => apiClient.put<DetalleSeccionCartaArticuloIndividual>(`/api/v1/detalles-seccion-carta-articulo/${id}`, data),
  remove: (id: number) => apiClient.del(`/api/v1/detalles-seccion-carta-articulo/${id}`),
};
