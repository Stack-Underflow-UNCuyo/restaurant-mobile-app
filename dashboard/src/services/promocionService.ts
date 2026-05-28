import { apiClient } from "@/lib/apiClient";
import { Promocion } from "@/types/promocion";

export const promocionService = {
    getAll: () => apiClient.get<Promocion[]>("/api/v1/promociones"),
    create: (data: Omit<Promocion, "id">) => apiClient.post<Promocion>("/api/v1/promociones", data),
    update: (id: number, data: Omit<Promocion, "id">) => apiClient.put<Promocion>(`/api/v1/promociones/${id}`, data),
    remove: (id: number) => apiClient.del(`/api/v1/promociones/${id}`),
};
