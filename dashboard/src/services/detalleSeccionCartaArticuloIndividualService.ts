import { apiClient } from "@/lib/apiClient";
import type { DetalleSeccionCartaArticuloIndividual } from "@/types/entities";

type DetalleSeccionCartaArticuloPayload = {
  seccionCartaId: string;
  precio: number;
  articuloId: string;
  imagen?: { nombre: string; mime: string; contenido: string; tipoImagen: string };
};

export const detalleSeccionCartaArticuloIndividualService = {
  getAll: () => apiClient.get<DetalleSeccionCartaArticuloIndividual[]>("/api/v1/detalles-seccion-carta-articulo"),
  create: (data: DetalleSeccionCartaArticuloPayload) => apiClient.post<DetalleSeccionCartaArticuloIndividual>("/api/v1/detalles-seccion-carta-articulo", data),
  update: (id: string, data: DetalleSeccionCartaArticuloPayload) => apiClient.put<DetalleSeccionCartaArticuloIndividual>(`/api/v1/detalles-seccion-carta-articulo/${id}`, data),
  remove: (id: string) => apiClient.del(`/api/v1/detalles-seccion-carta-articulo/${id}`),
};
