# Dashboard de Estadísticas (home del admin)

Documento de la pantalla de inicio del dashboard (`http://localhost:3000/`), que reemplaza
los widgets de demostración (datos hardcodeados) por **estadísticas reales** calculadas a
partir de las facturas y reseñas de la base.

---

## Resumen

La home del admin muestra 4 widgets con datos reales:

1. **Tarjetas resumen** — Total facturado y Facturas cobradas.
2. **Ingresos por mes** — gráfico de barras con la facturación mes a mes del año actual.
3. **Reseñas** — satisfacción general + promedio por categoría (Ambiente / Servicio / Comida).
4. **Medios de pago** — gráfico de dona con la distribución por tipo de pago.

**Enfoque:** todo el cálculo se hace en el **frontend**, a partir de dos llamadas GET ya
existentes (`/api/v1/facturas` y `/api/v1/resenias`). No se agregaron endpoints de
estadísticas en el backend; dado el volumen del proyecto, traer las filas y agregarlas en el
navegador es suficiente.

---

## Datos que se usan

### Facturas (`GET /api/v1/facturas`)
- `totalPagado` — monto cobrado (ya con descuento de promoción).
- `estado` — `PAGADA` / `ANULADA` / `SIN_DEFINIR`. **Solo las `PAGADA`** cuentan para
  ingresos, conteos y medios de pago.
- `fechaFactura` — `"YYYY-MM-DD"`; se usa para agrupar por mes.
- `formaDePago.tipoPago` — `EFECTIVO` / `TRANSFERENCIA` / `BILLETERA_VIRTUAL`.
- `numeroFactura` — para ordenar las "últimas facturas".

### Reseñas (`GET /api/v1/resenias`)
- `ambiente`, `servicio`, `comida` — puntajes 1–5.
- `observacion`, `fechaResenia`, `comandaId`.

> **Cambio de backend necesario:** el `ReseniaDto` antes **no** devolvía los puntajes
> (`ambiente/servicio/comida`); solo los recibía al crear. Se agregaron esos tres campos al
> DTO para poder graficarlos. MapStruct los mapea automáticamente por nombre (no hizo falta
> tocar el mapper). Archivo:
> `restaurant-server/.../business/domain/dto/resenia/ReseniaDto.java`.

---

## Arquitectura (dónde está cada cosa)

**Backend (`restaurant-server`)**
- `business/domain/dto/resenia/ReseniaDto.java` — se le agregaron `ambiente`, `servicio`,
  `comida`.

**Dashboard (`dashboard`)**
- `src/types/resenia.ts` — el tipo `Resenia` ahora incluye los tres puntajes.
- `src/lib/estadisticas.ts` — **funciones puras de agregación** (sin React, fáciles de testear).
- `src/components/estadisticas/` — los widgets + el contenedor:
  - `EstadisticasDashboard.tsx` — orquesta: hace **un solo** fetch, calcula los agregados y los
    reparte por props.
  - `ResumenCards.tsx`, `IngresosPorMesChart.tsx`, `ReseniasWidget.tsx`,
    `MediosDePagoChart.tsx` — los 4 widgets.
- `src/app/(admin)/page.tsx` — la home; ahora solo renderiza `<EstadisticasDashboard />`.

**Librería de gráficos:** `react-apexcharts` (la misma que usaban los widgets demo). Patrón:
`const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })`.

---

## Cómo se calculan las métricas (`src/lib/estadisticas.ts`)

Todas reciben `Factura[]` / `Resenia[]` y devuelven el agregado. Solo consideran facturas con
`estado === PAGADA` (vía el helper interno `pagadas`).

| Función | Devuelve |
|--------|----------|
| `resumen(facturas, resenias)` | `{ totalFacturado, cantFacturas, ticketPromedio, cantResenias }` |
| `ingresosPorMes(facturas, anio)` | `number[12]` (índice 0 = enero), suma de `totalPagado` por mes |
| `promediosResenia(resenias)` | `{ ambiente, servicio, comida, general }` (promedios; `general` = promedio de los 3) |
| `facturasPorTipoPago(facturas)` | conteo por `EFECTIVO` / `TRANSFERENCIA` / `BILLETERA_VIRTUAL` |

- De `resumen` se usan en pantalla **Total facturado** y **Facturas cobradas** (las tarjetas);
  `cantResenias` alimenta el encabezado del widget de Reseñas. `ticketPromedio` queda calculado
  pero hoy no se muestra.
- **Ingresos por mes** parsea el mes de `fechaFactura` (`"YYYY-MM-DD"`) y solo suma el año pedido.

---

## Flujo de datos (runtime)

```
EstadisticasDashboard  (use client)
  └─ useEffect → Promise.all([ facturaService.getAll(), reseniaService.getAll() ])
        ├─ loading → <Spinner/>
        ├─ error   → mensaje + toast.error
        └─ ok → useMemo calcula los agregados con lib/estadisticas.ts
                  └─ pasa por props a:
                       ResumenCards, IngresosPorMesChart,
                       ReseniasWidget, MediosDePagoChart
```

Los widgets **no fetchean**: reciben datos ya calculados. Así se hace una sola llamada a la API
y los gráficos quedan desacoplados (puros de presentación).

---

## ▶️ Cómo probarlo

1. **Backend:** `cd restaurant-server && mvn spring-boot:run` (PostgreSQL + variables de entorno).
   Verificá que `GET /api/v1/resenias` ahora trae `ambiente/servicio/comida`.
2. **Generar datos:** cobrá algunas comandas (Efectivo y Mercado Pago — ver `restaurant-server/MP.md`)
   y dejá reseñas (flujo post-pago del PASO 5 de MP.md) para tener facturas `PAGADA` y reseñas con puntaje.
3. **Dashboard:** `cd dashboard && npm run dev`, entrá como admin a `http://localhost:3000/`.
   - Tarjetas con total facturado / nº de facturas cobradas coherentes con la BD.
   - Barras de ingresos en los meses con facturas.
   - Reseñas con promedios 0–5 por categoría y satisfacción general.
   - Dona con la proporción de medios de pago.
4. **Contrastar** los números contra `GET /api/v1/facturas` y `GET /api/v1/resenias`.

---

## Notas / posibles mejoras

- Si la base crece mucho, conviene migrar a **endpoints de estadísticas** en el backend
  (`/api/v1/estadisticas/...`) con queries agregadas (`SUM`/`GROUP BY`) en vez de traer todas
  las filas. La capa `lib/estadisticas.ts` deja el cálculo aislado, así que el cambio sería
  acotado.
- `ingresosPorMes` usa el **año actual**. Se podría agregar un selector de año/rango (los
  widgets demo tenían un date-picker no funcional como referencia visual).
- Los componentes demo originales siguen en `src/components/ecommerce/` (sin usar) por si se
  quieren reutilizar.
- **Fix relacionado:** en el form de reseña móvil (`mobile-app/.../resenia/[mesaId].tsx`) los
  campos `servicio` y `comida` estaban cruzados al enviar; se corrigió para que las stats de
  esas categorías sean fieles.
