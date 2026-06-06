import { apiClient } from "@/lib/apiClient";
import type { Empleado } from "@/types/empleado";

type EmpleadoPayload = {
    nombre: string;
    apellido: string;
    fechaNacimiento: string;
    tipoDocumento: string;
    numeroDocumento: string;
    tipoEmpleado: string;
    direccionId: string;
    contactoTelefonicoIds: string[];
    contactoCorreoElectronicoIds: string[];
};

export const empleadoService = {
    getAll: () => apiClient.get<Empleado[]>("/api/v1/empleados"),
    create: (data: EmpleadoPayload) => apiClient.post<Empleado>("/api/v1/empleados", data),
    update: (id: string, data: EmpleadoPayload) => apiClient.put<Empleado>(`/api/v1/empleados/${id}`, data),
    remove: (id: string) => apiClient.del(`/api/v1/empleados/${id}`),
};
