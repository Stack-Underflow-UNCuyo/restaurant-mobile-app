import { apiClient } from "@/lib/apiClient";
import type { SeccionCarta } from "@/types/entities";

export const seccionCartaService = {
  getById: (id: string) => apiClient.get<SeccionCarta>(`/api/v1/secciones-carta/${id}`),
};
