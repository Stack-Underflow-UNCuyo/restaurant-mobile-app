import { apiClient } from "@/lib/apiClient";
import type { ContactoTelefonico } from "@/types/contactos";

export const contactoTelefonicoService = {
    getAll: () => apiClient.get<ContactoTelefonico[]>("/api/v1/contactos-telefonicos"),
    create: (data: Omit<ContactoTelefonico, "id">) => apiClient.post<ContactoTelefonico>("/api/v1/contactos-telefonicos", data),
    update: (id: number, data: Omit<ContactoTelefonico, "id">) => apiClient.put<ContactoTelefonico>(`/api/v1/contactos-telefonicos/${id}`, data),
    remove: (id: number) => apiClient.del(`/api/v1/contactos-telefonicos/${id}`),
};
