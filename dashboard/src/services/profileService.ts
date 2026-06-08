import { apiClient } from "@/lib/apiClient";
import type { Usuario } from "@/types/usuario";
import type { Persona } from "@/types/empleado";

export type PersonaUpdatePayload = {
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  tipoDocumento: string;
  numeroDocumento: string;
  direccionId: string | null;
  contactoCorreoElectronicoIds: string[];
  contactoTelefonicoIds: string[];
};

export type UsuarioUpdatePayload = {
  email: string;
  clave: string;
  rol: string;
  personaId: string | null;
};

export const profileService = {
  getUsuario: () =>
    apiClient.get<Usuario>(`/api/v1/usuarios/me`),
  updateUsuario: (data: UsuarioUpdatePayload) =>
    apiClient.put<Usuario>(`/api/v1/usuarios/me`, data),
  getPersona: (id: string) =>
    apiClient.get<Persona>(`/api/v1/personas/${id}`),
  updatePersona: (id: string, data: PersonaUpdatePayload) =>
    apiClient.put<Persona>(`/api/v1/personas/${id}`, data),
};
