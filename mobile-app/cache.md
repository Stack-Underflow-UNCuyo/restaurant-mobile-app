# Cache offline de solo lectura (app móvil)

Cómo la app móvil tolera cortes de internet **cacheando datos de solo lectura** en el celular,
para que el mozo siga viendo información aunque se caiga la conexión.

> Estado actual: cacheada la **Carta** completa — listado (`useCartas`), detalle de cada carta
> con sus secciones (`useCartaDetalle`) y detalle de cada sección con sus platos/opciones
> (`useSeccionDetalle`). `usePromociones` y `useMesas` todavía NO usan cache (ver
> [Cómo migrar otro hook](#cómo-migrar-otro-hook)).

---

## Qué problema resuelve

Antes, la app era **100% online**: lo único que se guardaba en el celular era el token de
sesión ([`tokenStorage.ts`](src/lib/tokenStorage.ts)). Todo el resto (carta, mesas, comandas,
promociones) vivía en memoria (`useState`) y se perdía al reiniciar la app o al cortarse
internet — quedaba una pantalla vacía o un error.

Ahora, los datos **de solo lectura** se cachean en disco. Si no hay red, se muestra el último
dato conocido en vez de fallar.

---

## Enfoque: React Query + persistencia, "stale-while-revalidate"

Usamos **[@tanstack/react-query](https://tanstack.com/query)** con persistencia en
**AsyncStorage**. En criollo:

- **Cache en memoria**: react-query guarda el resultado de cada pedido (query) en memoria. Si
  otra pantalla pide lo mismo, lo devuelve al instante sin volver a la red.
- **Stale-while-revalidate**: cuando volvés a una pantalla, te muestra el dato cacheado
  *inmediatamente* (aunque esté "viejo") y, si hay red, lo refresca de fondo. No ves spinner si
  ya había datos.
- **Persistencia en disco (AsyncStorage)**: el cache se escribe en el almacenamiento del
  celular, así sobrevive a cerrar/reabrir la app. Al arrancar, react-query **rehidrata** el
  cache desde disco.
- **Modo offline**: si no hay internet, la query queda "en pausa" y se sigue devolviendo el
  último `data` cacheado. La app no crashea.

AsyncStorage usa `localStorage` en web, igual que hace `tokenStorage` con el JWT.

---

## Arquitectura

| Pieza | Archivo | Qué hace |
|------|---------|----------|
| Client + persister | [`src/lib/queryClient.ts`](src/lib/queryClient.ts) | Crea el `QueryClient` (con los defaults de cache) y el `asyncStoragePersister`. |
| Provider | [`src/app/_layout.tsx`](src/app/_layout.tsx) | Envuelve toda la app en `PersistQueryClientProvider`, conectando el client con el persister. |
| Hooks de datos | [`src/controllers/hooks/useCartas.ts`](src/controllers/hooks/useCartas.ts), [`src/controllers/hooks/useCartaDetalle.ts`](src/controllers/hooks/useCartaDetalle.ts) | Usan `useQuery` por dentro, pero **mantienen la misma firma pública** de antes. |
| Limpieza | [`src/controllers/context/AuthContext.tsx`](src/controllers/context/AuthContext.tsx) | En `logout()` llama `queryClient.clear()` para no dejar datos del usuario anterior. |

### Defaults del cache (`queryClient.ts`)

| Opción | Valor | Significado |
|--------|-------|-------------|
| `staleTime` | 5 min | Cuánto se considera "fresco" el dato. Dentro de ese rango no refetchea al navegar. |
| `gcTime` | 24 h | Cuánto vive la entrada en cache sin uso. Debe ser **≥** `maxAge` del persister. |
| `maxAge` (persister) | 24 h | Antigüedad máxima del cache persistido que se rehidrata al abrir la app. |
| `retry` | 1 | Reintentos ante fallo de red (para no martillar con la conexión caída). |
| `networkMode` | `online` (default) | Offline ⇒ query en pausa, se devuelve el último `data` cacheado. |

### El patrón de hook (firma intacta)

`useCartas` pasó de `useState`/`useEffect` a `useQuery`, pero **devuelve exactamente lo mismo**
(`{ cartas, loading, refreshing, error, refresh }`), así que **ninguna pantalla cambió**. El
mapeo react-query → API del hook:

```ts
const { data, isPending, isFetching, error, refetch } = useQuery({
  queryKey: ["cartas"],
  queryFn: getCartas,
});
return {
  cartas: data ?? [],
  loading: isPending,
  refreshing: isFetching && !isPending,
  error: error instanceof Error ? error.message : null,
  refresh: () => { refetch(); },
};
```

---

## Qué está cacheado hoy

La **Carta** completa (catálogo de solo lectura, ideal para cachear):

| Dato | Hook | `queryKey` | Pantallas |
|------|------|-----------|-----------|
| Listado de cartas | `useCartas` | `["cartas"]` | `carta/index.tsx` |
| Detalle de una carta (sus secciones) | `useCartaDetalle` | `["carta", cartaId]` | `carta/[cartaId]/index.tsx`, `carta/[cartaId]/menu.tsx` |
| Detalle de una sección (sus platos/opciones: "Entrada", "Platos principales", etc.) | `useSeccionDetalle` | `["seccion", id]` | `seccion/[id].tsx` |

Las keys con id (`["carta", cartaId]`, `["seccion", id]`) cachean **cada carta/sección por
separado**: las que el mozo haya abierto al menos una vez quedan disponibles offline.

---

## Cómo migrar otro hook

Receta para sumar `promociones` o `mesas` en una segunda etapa:

1. En el hook, reemplazar el `useState`/`useEffect` por `useQuery`, manteniendo la **misma
   firma de retorno**.
2. Elegir una `queryKey` estable (p. ej. `["promociones"]`, `["mesas"]`).
3. Si el `queryFn` necesita el token, pasar `enabled: !!token` para no disparar sin sesión:
   ```ts
   useQuery({ queryKey: ["promociones"], queryFn: () => getPromociones(token), enabled: !!token });
   ```
4. **Mesas tiene una escritura** (`cambiarEstado`): reimplementar el update optimista con
   react-query — `queryClient.setQueryData(["mesas"], next)` para reflejar al instante,
   guardar el valor previo para hacer **rollback** en el `catch`, y `invalidateQueries(["mesas"])`
   al final para resincronizar con el backend.

---

## Limitaciones (a propósito)

- **Escrituras** (crear comanda, `cobrar`, dejar reseña): **no** hay cola offline ni
  idempotencia. Requieren internet. Implementarlas offline implicaría riesgo de cobros/pedidos
  duplicados, fuera del alcance actual.
- **Mercado Pago**: el cobro por QR depende de un *polling* en vivo contra el backend → no
  funciona sin conexión por diseño.
- **Comandas / Kanban**: datos muy volátiles (el kanban refresca cada 20 s). No se cachean para
  no mostrar comandas viejas como si fueran las actuales.

---

## Cómo probarlo

1. `npx expo start -c` (limpia caché de Metro). La app levanta sin errores.
2. **Stale-while-revalidate**: abrir la Carta con red → carga. Salir y volver → aparece al
   instante desde cache (sin spinner) y refresca de fondo.
3. **Offline**: con la carta ya cargada, activar **modo avión** → se sigue viendo el último dato
   conocido; el pull-to-refresh no rompe (query en pausa).
4. **Persistencia al reinicio**: cargar la carta online, **cerrar la app por completo**, ponerse
   offline y reabrir → la carta se muestra desde AsyncStorage.
5. **Logout**: cerrar sesión y reabrir → no queda la carta del usuario anterior en cache.
