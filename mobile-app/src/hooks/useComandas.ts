/**
 * Estado del dashboard de comandas: carga la lista (de toda la casa o de una
 * mesa puntual, según se le pase mesaId) junto con sus líneas de pedido, y
 * expone el pull-to-refresh. Espejo de useMesas.
 */
import { useCallback, useEffect, useState } from "react";
import Toast from "react-native-toast-message";

import { useAuth } from "@/context/AuthContext";
import { getComandas, getComandasPorMesa, getDetallesComanda } from "@/services/comandaService";
import { updateEstadoDetalle } from "@/services/detalleComandaService";
import type { Comanda, DetalleComanda } from "@/types/comanda";

export interface ComandaConDetalles extends Comanda {
  detalles: DetalleComanda[];
}

interface UseComandasResult {
  comandas: ComandaConDetalles[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  refresh: () => void;
  despacharDetalle: (detalle: DetalleComanda) => void;
}

/** Si se pasa mesaId, trae solo las comandas de esa mesa; si no, todas. */
export function useComandas(mesaId?: string | null): UseComandasResult {
  const { token } = useAuth();
  const [comandas, setComandas] = useState<ComandaConDetalles[]>([]);
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
        const base = mesaId ? await getComandasPorMesa(token, mesaId) : await getComandas(token);
        const conDetalles = await Promise.all(
          base.map(async (comanda): Promise<ComandaConDetalles> => ({
            ...comanda,
            detalles: await getDetallesComanda(token, comanda.id),
          })),
        );
        setComandas(conDetalles);
      } catch (e) {
        setError(e instanceof Error ? e.message : "No se pudieron cargar las comandas.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [token, mesaId],
  );

  useEffect(() => {
    cargar("initial");
  }, [cargar]);

  const refresh = useCallback(() => {
    cargar("refresh");
  }, [cargar]);

  const despacharDetalle = useCallback(
    (detalle: DetalleComanda) => {
      if (!token) return;
      const nuevoEstado = "ENTREGADO_AL_CLIENTE" as const;
      setComandas((prev) =>
        prev.map((c) => ({
          ...c,
          detalles: c.detalles.map((d) =>
            d.id === detalle.id ? { ...d, estadoDetalleComanda: nuevoEstado } : d,
          ),
        })),
      );
      Toast.show({ type: "success", text1: "Ítem entregado al cliente", visibilityTime: 2000 });
      updateEstadoDetalle(token, detalle.comandaId, detalle.id, {
        cantidad: detalle.cantidad,
        estadoDetalleComanda: nuevoEstado,
        comandaId: detalle.comandaId,
        detalleSeccionCartaId: detalle.detalleSeccionCartaId,
      }).catch(() => {
        setComandas((prev) =>
          prev.map((c) => ({
            ...c,
            detalles: c.detalles.map((d) =>
              d.id === detalle.id ? { ...d, estadoDetalleComanda: detalle.estadoDetalleComanda } : d,
            ),
          })),
        );
        Toast.show({ type: "error", text1: "No se pudo actualizar el ítem", visibilityTime: 3000 });
      });
    },
    [token],
  );

  return { comandas, loading, refreshing, error, refresh, despacharDetalle };
}
