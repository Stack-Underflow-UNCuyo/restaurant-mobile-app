import { apiClient } from "@/lib/apiClient";
import type { Localidad } from "@/types/entities";

type LocalidadPayload = { nombre: string; codigoPostal: string; departamentoId: string };

export const localidadService = {
  getAll: () => apiClient.get<Localidad[]>("/api/v1/localidades"),
  create: (data: LocalidadPayload) => apiClient.post<Localidad>("/api/v1/localidades", data),
  update: (id: string, data: LocalidadPayload) => apiClient.put<Localidad>(`/api/v1/localidades/${id}`, data),
  remove: (id: string) => apiClient.del(`/api/v1/localidades/${id}`),
};
