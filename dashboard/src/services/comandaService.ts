import { apiClient } from "@/lib/apiClient";
import type { ComandaDto } from "@/types/comanda";

export const comandaService = {
  getAll: () => apiClient.get<ComandaDto[]>("/api/v1/comandas"),
};
