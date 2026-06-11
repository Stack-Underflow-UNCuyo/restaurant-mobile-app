/**
 * Carga las promociones disponibles para aplicar en la pantalla de pago.
 * Modelado sobre useMesas: trae la lista una vez con el token de sesión.
 * Si falla, no rompe el pago: deja la lista vacía (simplemente no hay promo
 * aplicable) y expone el error 
 */
import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/controllers/context/AuthContext";
import { getPromociones } from "@/models/services/promocionService";
import type { Promocion } from "@/models/types/promocion";

interface UsePromocionesResult {
  promociones: Promocion[];
  loading: boolean;
  error: string | null;
}

export function usePromociones(): UsePromocionesResult {
  const { token } = useAuth();
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      setPromociones(await getPromociones(token));
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudieron cargar las promociones.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { promociones, loading, error };
}
