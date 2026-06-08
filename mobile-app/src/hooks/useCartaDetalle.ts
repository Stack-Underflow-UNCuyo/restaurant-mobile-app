/**
 * Estado del detalle de una carta (con sus secciones): carga, error y refresh.
 * Lo usan la pantalla de secciones y la vista previa del menú.
 */
import { useCallback, useEffect, useState } from "react";

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
  const [carta, setCarta] = useState<Carta | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshId, setRefreshId] = useState(0);

  useEffect(() => {
    if (!cartaId) return;
    let cancelled = false;
    getCartaById(cartaId)
      .then((data) => {
        if (!cancelled) {
          setCarta(data);
          setError(null);
          setLoading(false);
          setRefreshing(false);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "No se pudo cargar la carta.");
          setLoading(false);
          setRefreshing(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [cartaId, refreshId]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    setRefreshId((id) => id + 1);
  }, []);

  return { carta, loading, refreshing, error, refresh };
}
