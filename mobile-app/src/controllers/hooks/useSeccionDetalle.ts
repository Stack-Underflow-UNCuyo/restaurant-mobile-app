/**
 * Estado del detalle de una sección de carta (con sus platos: las opciones que
 * se ven al entrar a "Entrada", "Platos principales", etc.). Internamente usa
 * React Query (cache + persistencia en AsyncStorage), con una key por sección:
 * cada sección abierta queda cacheada y se ve offline. La firma pública se
 * mantiene igual. Ver `cache.md`.
 */
import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";

import { getSeccionCartaById } from "@/models/services/seccionCartaService";
import type { SeccionCarta } from "@/models/types/carta";

interface UseSeccionDetalleResult {
  seccion: SeccionCarta | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  refresh: () => void;
}

export function useSeccionDetalle(id: string | undefined): UseSeccionDetalleResult {
  const { data, isPending, isFetching, error, refetch } = useQuery({
    queryKey: ["seccion", id],
    queryFn: () => getSeccionCartaById(id!),
    enabled: !!id,
  });

  const refresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    seccion: data ?? null,
    loading: isPending,
    refreshing: isFetching && !isPending,
    error: error instanceof Error ? error.message : null,
    refresh,
  };
}
