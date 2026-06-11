/**
 * Estado de la lista de cartas. Internamente usa React Query (cache +
 * persistencia en AsyncStorage), así la carta se ve al instante desde cache y
 * sobrevive a reinicios / cortes de internet. La firma pública se mantiene
 * igual que antes para no tocar las pantallas que la consumen. Ver `cache.md`.
 */
import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";

import { getCartas } from "@/models/services/cartaService";
import type { Carta } from "@/models/types/carta";

interface UseCartasResult {
  cartas: Carta[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  refresh: () => void;
}

export function useCartas(): UseCartasResult {
  const { data, isPending, isFetching, error, refetch } = useQuery({
    queryKey: ["cartas"],
    queryFn: getCartas,
  });

  const refresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    cartas: data ?? [],
    loading: isPending,
    refreshing: isFetching && !isPending,
    error: error instanceof Error ? error.message : null,
    refresh,
  };
}
