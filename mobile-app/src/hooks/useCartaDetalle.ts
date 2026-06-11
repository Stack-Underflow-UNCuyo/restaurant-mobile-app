/**
 * Estado del detalle de una carta (con sus secciones: entradas, platos
 * principales, etc.). Lo usan la pantalla de secciones y la vista previa del
 * menú. Internamente usa React Query (cache + persistencia en AsyncStorage),
 * con una key por carta: cada carta abierta queda cacheada y se ve offline.
 * La firma pública se mantiene igual. Ver `cache.md`.
 */
import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";

import { getCartaById } from "@/services/cartaService";
import type { Carta } from "@/types/carta";

interface UseCartaDetalleResult {
  carta: Carta | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  refresh: () => void;
}

export function useCartaDetalle(cartaId: string | undefined): UseCartaDetalleResult {
  const { data, isPending, isFetching, error, refetch } = useQuery({
    queryKey: ["carta", cartaId],
    queryFn: () => getCartaById(cartaId!),
    enabled: !!cartaId,
  });

  const refresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    carta: data ?? null,
    loading: isPending,
    refreshing: isFetching && !isPending,
    error: error instanceof Error ? error.message : null,
    refresh,
  };
}
