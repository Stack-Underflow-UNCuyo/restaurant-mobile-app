import { apiClient } from "@/lib/apiClient";
import type { Usuario } from "@/types/usuario";

type UsuarioPayload = {email: string; clave: string; rol: string; personaId: number };

export const usuarioService = {
    getAll: () => apiClient.get<Usuario[]>("/api/v1/usuarios"),
    create: (data: UsuarioPayload) => apiClient.post<Usuario>("/api/v1/usuarios/crear", data),
    update: (id: number, data: UsuarioPayload) => apiClient.put<Usuario>(`/api/v1/usuarios/${id}`, data),
    remove: (id: number) => apiClient.del(`/api/v1/usuarios/${id}`),
};
