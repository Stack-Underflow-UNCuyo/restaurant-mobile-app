/**
 * Estado de la lista de cartas: carga, error y refresh (espejo de useMesas
 * pero de solo lectura — la carta digital no tiene mutaciones).
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

  const cargar = useCallback(async (mode: "initial" | "refresh") => {
    if (mode === "refresh") setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      setCartas(await getCartas());
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudieron cargar las cartas.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    cargar("initial");
  }, [cargar]);

  const refresh = useCallback(() => {
    cargar("refresh");
  }, [cargar]);

  return { cartas, loading, refreshing, error, refresh };
}
