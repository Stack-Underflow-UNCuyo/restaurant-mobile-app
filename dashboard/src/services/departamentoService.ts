import { apiClient } from "@/lib/apiClient";
import type { Departamento } from "@/types/entities";

type DepartamentoPayload = { nombre: string; provinciaId: string };

export const departamentoService = {
  getAll: () => apiClient.get<Departamento[]>("/api/v1/departamentos"),
  create: (data: DepartamentoPayload) => apiClient.post<Departamento>("/api/v1/departamentos", data),
  update: (id: number, data: DepartamentoPayload) => apiClient.put<Departamento>(`/api/v1/departamentos/${id}`, data),
  remove: (id: number) => apiClient.del(`/api/v1/departamentos/${id}`),
};
