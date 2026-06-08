/**
 * Estado del detalle de una sección de carta (con sus platos): carga, error
 * y refresh — misma forma que useCartaDetalle.
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

  const cargar = useCallback(
    async (mode: "initial" | "refresh") => {
      if (!id) return;
      if (mode === "refresh") setRefreshing(true);
      else setLoading(true);
      setError(null);
      try {
        setSeccion(await getSeccionCartaById(id));
      } catch (e) {
        setError(e instanceof Error ? e.message : "No se pudo cargar la sección.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [id],
  );

  useEffect(() => {
    cargar("initial");
  }, [cargar]);

  const refresh = useCallback(() => {
    cargar("refresh");
  }, [cargar]);

  return { seccion, loading, refreshing, error, refresh };
}
