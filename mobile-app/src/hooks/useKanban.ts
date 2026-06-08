import { useCallback, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { getComandas, getDetallesComanda } from "@/services/comandaService";
import { updateEstadoDetalle } from "@/services/detalleComandaService";
import type { DetalleComanda, EstadoDetalleComanda } from "@/types/comanda";

const KANBAN_STATES: EstadoDetalleComanda[] = [
  "ENVIADO_A_LA_COCINA",
  "COCINERO_ASIGNADO",
  "ENTREGADO_PARA_DESPACHAR",
];

const POLL_INTERVAL_MS = 20_000;

interface UseKanbanResult {
  pendiente: DetalleComanda[];
  enProceso: DetalleComanda[];
  listo: DetalleComanda[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  refresh: () => void;
  moverDetalle: (detalle: DetalleComanda, nuevoEstado: EstadoDetalleComanda) => void;
}

export function useKanban(): UseKanbanResult {
  const { token } = useAuth();
  const [detalles, setDetalles] = useState<DetalleComanda[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(
    async (mode: "initial" | "refresh" | "poll") => {
      if (!token) return;
      if (mode === "refresh") setRefreshing(true);
      else if (mode === "initial") setLoading(true);
      if (mode !== "poll") setError(null);
      try {
        const comandas = await getComandas(token);
        const abiertas = comandas.filter((c) => c.estadoComanda === "ABIERTA");
        const allDetalles = (
          await Promise.all(abiertas.map((c) => getDetallesComanda(token, c.id)))
        ).flat();
        setDetalles(allDetalles.filter((d) => KANBAN_STATES.includes(d.estadoDetalleComanda)));
      } catch (e) {
        if (mode !== "poll") {
          setError(e instanceof Error ? e.message : "No se pudieron cargar los pedidos.");
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [token],
  );

  useEffect(() => {
    cargar("initial");
    const id = setInterval(() => cargar("poll"), POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [cargar]);

  const refresh = useCallback(() => cargar("refresh"), [cargar]);

  const moverDetalle = useCallback(
    (detalle: DetalleComanda, nuevoEstado: EstadoDetalleComanda) => {
      if (!token) return;
      // Optimistic update
      setDetalles((prev) =>
        prev.map((d) => (d.id === detalle.id ? { ...d, estadoDetalleComanda: nuevoEstado } : d)),
      );
      updateEstadoDetalle(token, detalle.comandaId, detalle.id, {
        cantidad: detalle.cantidad,
        estadoDetalleComanda: nuevoEstado,
        comandaId: detalle.comandaId,
        detalleSeccionCartaId: detalle.detalleSeccionCartaId,
      }).catch(() => {
        // Rollback on error
        setDetalles((prev) =>
          prev.map((d) =>
            d.id === detalle.id ? { ...d, estadoDetalleComanda: detalle.estadoDetalleComanda } : d,
          ),
        );
      });
    },
    [token],
  );

  const pendiente = useMemo(
    () => detalles.filter((d) => d.estadoDetalleComanda === "ENVIADO_A_LA_COCINA"),
    [detalles],
  );
  const enProceso = useMemo(
    () => detalles.filter((d) => d.estadoDetalleComanda === "COCINERO_ASIGNADO"),
    [detalles],
  );
  const listo = useMemo(
    () => detalles.filter((d) => d.estadoDetalleComanda === "ENTREGADO_PARA_DESPACHAR"),
    [detalles],
  );

  return { pendiente, enProceso, listo, loading, refreshing, error, refresh, moverDetalle };
}
