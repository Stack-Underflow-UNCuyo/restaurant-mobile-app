import { apiClient } from "@/lib/apiClient";
import type { Empresa } from "@/types/entities";

type EmpresaUpdatePayload = {
    nombre: string;
    direccionId: string;
    contactoIds?: string[];
};

export const empresaService = {
    getActive: () => apiClient.get<Empresa>("/api/v1/empresa"),
    update: (data: EmpresaUpdatePayload) => apiClient.put<Empresa>("/api/v1/empresa", data),
};
