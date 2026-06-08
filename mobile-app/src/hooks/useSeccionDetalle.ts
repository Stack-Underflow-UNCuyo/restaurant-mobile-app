/**
 * Estado del detalle de una sección de carta (con sus platos): carga, error y refresh.
 */
import { useCallback, useEffect, useState } from "react";

import { getSeccionCartaById } from "@/services/seccionCartaService";
import type { SeccionCarta } from "@/types/carta";

interface UseSeccionDetalleResult {
  seccion: SeccionCarta | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  refresh: () => void;
}

export function useSeccionDetalle(id: string | undefined): UseSeccionDetalleResult {
  const [seccion, setSeccion] = useState<SeccionCarta | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshId, setRefreshId] = useState(0);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    getSeccionCartaById(id)
      .then((data) => {
        if (!cancelled) {
          setSeccion(data);
          setError(null);
          setLoading(false);
          setRefreshing(false);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "No se pudo cargar la sección.");
          setLoading(false);
          setRefreshing(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id, refreshId]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    setRefreshId((id) => id + 1);
  }, []);

  return { seccion, loading, refreshing, error, refresh };
}
