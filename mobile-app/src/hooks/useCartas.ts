/**
 * Estado de la lista de cartas: carga, error y refresh.
 * Todos los setState se ejecutan dentro de callbacks asíncronos (.then/.catch)
 * para cumplir con react-hooks/set-state-in-effect.
 */
import { useCallback, useEffect, useState } from "react";

import { getCartas } from "@/services/cartaService";
import type { Carta } from "@/types/carta";

interface UseCartasResult {
  cartas: Carta[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  refresh: () => void;
}

export function useCartas(): UseCartasResult {
  const [cartas, setCartas] = useState<Carta[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshId, setRefreshId] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getCartas()
      .then((data) => {
        if (!cancelled) {
          setCartas(data);
          setError(null);
          setLoading(false);
          setRefreshing(false);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "No se pudieron cargar las cartas.");
          setLoading(false);
          setRefreshing(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [refreshId]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    setRefreshId((id) => id + 1);
  }, []);

  return { cartas, loading, refreshing, error, refresh };
}
