/**
 * Estado del detalle de una carta (con sus secciones): carga, error y
 * refresh. Lo usan tanto la pantalla de secciones como la vista previa del
 * menú, que necesitan la misma Carta completa.
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

  const cargar = useCallback(
    async (mode: "initial" | "refresh") => {
      if (!cartaId) return;
      if (mode === "refresh") setRefreshing(true);
      else setLoading(true);
      setError(null);
      try {
        setCarta(await getCartaById(cartaId));
      } catch (e) {
        setError(e instanceof Error ? e.message : "No se pudo cargar la carta.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [cartaId],
  );

  useEffect(() => {
    cargar("initial");
  }, [cargar]);

  const refresh = useCallback(() => {
    cargar("refresh");
  }, [cargar]);

  return { carta, loading, refreshing, error, refresh };
}
