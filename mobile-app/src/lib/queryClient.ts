/**
 * Cliente de React Query + persistencia en AsyncStorage.
 *
 * Estrategia: cache de solo lectura con "stale-while-revalidate". Las queries
 * devuelven el último dato conocido al instante (incluido tras reiniciar la app
 * o sin internet) y refrescan de fondo cuando hay red. Ver `cache.md`.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";

/** 24 h: tiempo que una entrada sobrevive en cache y en disco. */
export const CACHE_MAX_AGE = 1000 * 60 * 60 * 24;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Se considera "fresco" 5 min: no refetchea en cada navegación.
      staleTime: 1000 * 60 * 5,
      // Debe ser >= maxAge del persister para que las entradas no se descarten
      // antes de poder persistirse/restaurarse.
      gcTime: CACHE_MAX_AGE,
      // No martillar la red cuando está caída.
      retry: 1,
      // networkMode "online" (default): offline => la query queda en pausa y
      // se sigue devolviendo el último `data` cacheado.
    },
  },
});

export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});
