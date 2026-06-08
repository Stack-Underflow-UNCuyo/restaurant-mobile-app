import { apiClient } from "@/lib/apiClient";
import type { SeccionCarta } from "@/types/entities";

type SeccionCartaPayload = {
  nombre: string;
  categoriaNombre?: string;
  imagen?: { nombre: string; mime: string; contenido: string; tipoImagen: string };
};

export const seccionCartaService = {
  getAll: () => apiClient.get<SeccionCarta[]>("/api/v1/secciones-carta"),
  create: (data: SeccionCartaPayload) => apiClient.post<SeccionCarta>("/api/v1/secciones-carta", { ...data, detallesSeccionCarta: [] }),
  update: (id: string, data: SeccionCartaPayload) => apiClient.put<SeccionCarta>(`/api/v1/secciones-carta/${id}`, { ...data, detallesSeccionCarta: [] }),
  remove: (id: string) => apiClient.del(`/api/v1/secciones-carta/${id}`),
};
