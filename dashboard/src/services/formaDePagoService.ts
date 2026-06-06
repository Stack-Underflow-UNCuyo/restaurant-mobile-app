import { apiClient } from "@/lib/apiClient";
import { FormaDePago } from "@/types/formaDePago";

export const formaDePagoService = {
    getAll: () => apiClient.get<FormaDePago[]>("/api/v1/formas-de-pago"),
    create: (data: Omit<FormaDePago, "id">) => apiClient.post<FormaDePago>("/api/v1/formas-de-pago", data),
    update: (id: number, data: Omit<FormaDePago, "id">) => apiClient.put<FormaDePago>(`/api/v1/formas-de-pago/${id}`, data),
    remove: (id: number) => apiClient.del(`/api/v1/formas-de-pago/${id}`),
};
