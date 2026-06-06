import { apiClient } from "@/lib/apiClient";
import type { Direccion } from "@/types/entities";

type DireccionPayload = { calle: string; numeracion: string; barrio:string; observacion?: string; localidadId: string };

export const direccionService = {
    getAll: () => apiClient.get<Direccion[]>("/api/v1/direcciones"),
    create: (data: DireccionPayload) => apiClient.post<Direccion>("/api/v1/direcciones", data),
    update: (id: string, data: DireccionPayload) => apiClient.put<Direccion>(`/api/v1/direcciones/${id}`, data),
    remove: (id: string) => apiClient.del(`/api/v1/direcciones/${id}`),
};
    