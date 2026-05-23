import { apiClient } from "@/lib/apiClient";
import type { ContactoCorreoElectronico } from "@/types/contactos";

export const contactoCorreoElectronicoService = {
    getAll: () => apiClient.get<ContactoCorreoElectronico[]>("/api/v1/contactos-correo"),
    create: (data: Omit<ContactoCorreoElectronico, "id">) => apiClient.post<ContactoCorreoElectronico>("/api/v1/contactos-correo", data),
    update: (id: number, data: Omit<ContactoCorreoElectronico, "id">) => apiClient.put<ContactoCorreoElectronico>(`/api/v1/contactos-correo/${id}`, data),
    remove: (id: number) => apiClient.del(`/api/v1/contactos-correo/${id}`),
};
