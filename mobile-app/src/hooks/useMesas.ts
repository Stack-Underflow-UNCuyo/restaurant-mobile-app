/**
 * Estado y acciones del dashboard de mesas.
 * Centraliza la carga, el pull-to-refresh y el cambio de estado (optimista con rollback).
 */
import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { getMesas, updateEstadoMesa } from "@/services/mesaService";
import type { EstadoMesa, Mesa } from "@/types/mesa";

interface UseMesasResult {
  mesas: Mesa[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  refresh: () => void;
  cambiarEstado: (mesa: Mesa, estado: EstadoMesa) => Promise<void>;
}

export function useMesas(): UseMesasResult {
  const { token } = useAuth();
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(
    async (mode: "initial" | "refresh") => {
      if (!token) return;
      if (mode === "refresh") setRefreshing(true);
      else setLoading(true);
      setError(null);
      try {
        setMesas(await getMesas(token));
      } catch (e) {
        setError(e instanceof Error ? e.message : "No se pudieron cargar las mesas.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [token],
  );

  useEffect(() => {
    cargar("initial");
  }, [cargar]);

  const refresh = useCallback(() => {
    cargar("refresh");
  }, [cargar]);

  const cambiarEstado = useCallback(
    async (mesa: Mesa, estado: EstadoMesa) => {
      if (!token || mesa.estadoMesa === estado) return;

      // Update optimista: reflejamos el cambio al instante.
      const anterior = mesas;
      setMesas((prev) => prev.map((m) => (m.id === mesa.id ? { ...m, estadoMesa: estado } : m)));

      try {
        const actualizada = await updateEstadoMesa(token, mesa, estado);
        // Confiamos en la respuesta del backend por si normaliza algún campo.
        setMesas((prev) => prev.map((m) => (m.id === mesa.id ? actualizada : m)));
      } catch (e) {
        setMesas(anterior); // rollback
        throw e instanceof Error ? e : new Error("No se pudo cambiar el estado de la mesa.");
      }
    },
    [token, mesas],
  );

  return { mesas, loading, refreshing, error, refresh, cambiarEstado };
}
