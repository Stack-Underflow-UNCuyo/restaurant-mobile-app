import { apiClient } from "@/lib/apiClient";
import type { Empresa } from "@/types/entities";

export const empresaService = {
  getActive: () => apiClient.get<Empresa>("/api/v1/empresa"),
};
