import { apiClient } from "@/lib/apiClient";
import type { DetalleSeccionCarta } from "@/types/detalleSeccionCarta";

export const detalleSeccionCartaService = {
  getAll: () => apiClient.get<DetalleSeccionCarta[]>("/api/v1/detalles-seccion-carta"),
  getAllTodos: () => apiClient.get<DetalleSeccionCarta[]>("/api/v1/detalles-seccion-carta/todos"),
};
