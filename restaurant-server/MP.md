# Integración Mercado Pago — Pagos presenciales por QR

Documento completo del flujo de cobro integrado con **Mercado Pago** (modo *instore* / QR) y del cobro en **Efectivo**, con el detalle de qué hace cada parte y **cómo probarlo**.

Está pensado para que cualquiera del equipo lo lea de arriba a abajo y entienda el flujo entero. Si solo querés **probarlo**, saltá a la sección [▶️ Cómo probarlo](#️-cómo-probarlo).

---

## Resumen del flujo

El cobro de una mesa puede hacerse de dos formas, ambas desde la app del mozo (pantalla **Pagar**):

- **Efectivo:** el mozo confirma que cobró → el backend genera la factura `PAGADA`.
- **Mercado Pago (QR dinámico):** el backend crea una *order* de cobro en MP → la app muestra el **QR** → el cliente lo escanea y paga → la app detecta el pago (polling) → el backend genera la factura `PAGADA`.

En **ambos** casos, al guardarse la factura el sistema:
- pasa la **comanda** a estado `FINALIZADA`, y
- libera la **mesa** (estado `LIBRE`).

Para que el cobro por QR funcione, antes hay que crear **una vez** la *sucursal* (store) y la *caja* (POS) en Mercado Pago. Eso es el PASO 1 (configuración inicial).

```
Configuración (1 sola vez)        Por cada cobro
┌───────────────────────┐        ┌──────────────────────────────────────────────┐
│ PASO 1                 │        │ App del mozo → Pagar                          │
│  crear Sucursal (store)│        │  ├─ Efectivo  → POST /facturas/cobrar         │
│  crear Caja (POS)      │        │  └─ Mercado Pago:                             │
└───────────────────────┘        │       PASO 2  POST /mercadopago/orders  → QR  │
                                  │       PASO 3  la app muestra el QR            │
                                  │       PASO 4  polling confirmar-pago → factura│
                                  └──────────────────────────────────────────────┘
                                        ↓ al generarse la factura (ambos casos)
                                   comanda FINALIZADA + mesa LIBRE
```

---

## Credenciales y configuración

> ⚠️ Las credenciales de abajo son de un entorno de **prueba (test)** para un proyecto académico. Están como *default* en `application.properties` pero son sobreescribibles por variables de entorno. No las publiques; si se filtran, rotalas desde el panel de Mercado Pago.

| Dato | Valor (test) |
|------|--------------|
| N.º de aplicación | `7595381034874467` |
| Public key | `APP_USR-5b4f1aff-7d76-4539-afc5-25ed654f73a2` |
| User ID (vendedor / collector) | `3462667386` |
| Usuario de prueba | `TESTUSER5699838547818991682` |
| Access Token | `APP_USR-7595381034874467-...` (ver `application.properties`) |

**`application.properties`** (prefijo `mercado-pago`):
```properties
mercado-pago.base-url=https://api.mercadopago.com
mercado-pago.access-token=${MP_ACCESS_TOKEN:APP_USR-7595381034874467-...}
mercado-pago.user-id=${MP_USER_ID:3462667386}
```
- Se leen en `config/MercadoPagoProperties.java` (`@ConfigurationProperties("mercado-pago")`).
- Para usar **otras** credenciales sin tocar código: definí las variables de entorno `MP_ACCESS_TOKEN` y `MP_USER_ID`.
- El cliente HTTP saliente es un `RestTemplate` (`config/MercadoPagoConfig.java`); el Access Token se manda como header `Authorization: Bearer ...` en cada llamada.

**Forma de pago:** "Mercado Pago" se corresponde con el seed `TipoPago.TRANSFERENCIA`; "Efectivo" con `TipoPago.EFECTIVO`.

---

## Arquitectura (dónde está cada cosa)

**Backend (`restaurant-server`)**
- Config: `config/MercadoPagoProperties.java`, `config/MercadoPagoConfig.java`.
- Entidades (`business/domain/entity/`): `Sucursal`, `Caja`, `Orden`.
- Repos (`business/repository/`): `SucursalRepository`, `CajaRepository`, `OrdenRepository`, y `FormaDePagoRepository` (con `findByTipoPagoAndEliminadoFalse`).
- DTOs (`business/domain/dto/mercadopago/` y `.../factura/`): `SucursalCreateDto/SucursalDto`, `CajaCreateDto/CajaDto`, `OrdenCreateDto/OrdenDto`, `SyncResultDto`, `EstadoOrdenDto`, `CobrarFacturaDto`.
- Servicios: `MercadoPagoService` (todo lo de MP), `FacturaService` (generación de factura + efectos secundarios), `FormaDePagoService.buscarPorTipoPago`.
- Controllers: `MercadoPagoController` (`/api/v1/mercadopago`), `FacturaController` (`/api/v1/facturas`).

**App móvil (`mobile-app`)**
- Tipos: `src/models/types/orden.ts` (`OrdenMP`, `EstadoOrden`).
- Servicios: `src/models/services/mercadoPagoService.ts` (`crearOrden`, `confirmarPago`), `src/models/services/facturaService.ts` (`cobrar`).
- UI: `src/views/components/pagar/MedioPagoModal.tsx` (selección de medio de pago, QR, polling, éxito) y la pantalla `src/app/(mozo)/pagar/[mesaId].tsx`.
- Dependencias agregadas: `react-native-svg` y `react-native-qrcode-svg` (para dibujar el QR).

---

## Endpoints

| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| POST | `/api/v1/mercadopago/sucursal` | ADMIN | Crea la sucursal (store) en MP y la persiste |
| POST | `/api/v1/mercadopago/caja` | ADMIN | Crea la caja (POS) en MP y la persiste |
| POST | `/api/v1/mercadopago/sync` | ADMIN | Trae de MP sucursales/cajas existentes y las repuebla (upsert por externalId) |
| GET | `/api/v1/mercadopago/sucursales` | autenticado | Lista sucursales persistidas |
| GET | `/api/v1/mercadopago/cajas` | autenticado | Lista cajas persistidas (incluye QR) |
| POST | `/api/v1/mercadopago/orders` | autenticado (mozo) | Crea una order de cobro (QR dinámico); devuelve `qrData` |
| GET | `/api/v1/mercadopago/orders` | autenticado | Lista orders persistidas |
| POST | `/api/v1/mercadopago/orders/{id}/confirmar-pago` | autenticado (mozo) | Consulta el estado en MP; si está pagada, genera factura + efectos |
| POST | `/api/v1/facturas/cobrar` | autenticado (mozo) | Cobro en efectivo: genera factura `PAGADA` + efectos |

Seguridad (`security/WebSecurityConfig.java`): solo los **POST** de `sucursal`, `caja` y `sync` exigen rol `ADMIN`. El resto cae en `anyRequest().authenticated()`, accesible al mozo (rol `PERSONAL`).

---

## PASO 1 — Crear Sucursal y Caja (configuración inicial)

Setup de admin que se corre **una sola vez** (o al cambiar de cuenta de MP). Crea en Mercado Pago el establecimiento (sucursal/store) y el punto de venta (caja/POS), y los persiste en nuestra base.

- APIs de MP usadas: `POST /users/{user_id}/stores` y `POST /pos`.
- Lógica: `MercadoPagoService.crearSucursal` y `crearCaja`.
- El `external_id` lo definimos nosotros (ej. `SUC001`, `SUC001POS001`). **Importante:** el de la caja (`SUC001POS001`) es el que después usa el cobro (PASO 2) como `external_pos_id`.
- La respuesta de la caja incluye datos del QR (`qrImage`), pero para el cobro usamos el **QR dinámico** por order (ver PASO 2).

### Restaurar tras borrar la base local (sync)
La sucursal y la caja **siguen existiendo en Mercado Pago** aunque borres la base local; por eso re-crearlas daría `409` (external_id duplicado). Para repoblar la base sin recrear nada:
```
POST /api/v1/mercadopago/sync   (Bearer admin)
```
Consulta a MP (`GET /users/{user_id}/stores/search` y `GET /pos`) y hace **upsert por externalId** (idempotente: correrlo varias veces no duplica).

---

## PASO 2 — Crear una Order (QR dinámico)

Por cada cobro con Mercado Pago se crea una *order*. Usamos **modelo dinámico**: se genera un QR único por cada order/monto, así varias mesas pueden cobrar en paralelo.

- API de MP: `POST {base}/v1/orders` (Orders API nueva), con headers `Authorization: Bearer`, `Content-Type: application/json` y **`X-Idempotency-Key`** (UUID, obligatorio).
- Lógica: `MercadoPagoService.crearOrden`. Arma el body con `type=qr`, `total_amount`, `transactions.payments[0].amount`, `config.qr.external_pos_id` = `external_id` de la caja, `config.qr.mode = "dynamic"`.
- Devuelve `OrdenDto` con `orderId`, `paymentId`, `status` (`created`) y **`qrData`** (string EMVCo). La order se persiste (entidad `Orden`), guardando también `comandaId` y `promocionId` para usarlos al confirmar el pago.

> El `qrData` **no es una URL**: es el contenido EMVCo que se debe **renderizar como QR**.

---

## PASO 3 — Mostrar el QR en la app del mozo

En la pantalla **Pagar**, el mozo elige el total (con o sin propina), toca **Ir a Pagar** y elige **Mercado Pago** → **Generar QR de cobro**.

- La app llama a `POST /api/v1/mercadopago/orders` (`src/models/services/mercadoPagoService.ts`).
- Renderiza el `qrData` con `<QRCode value={qrData} />` (`react-native-qrcode-svg`) en `MedioPagoModal.tsx`.
- El cliente escanea ese QR con la app de Mercado Pago.

---

## PASO 4 — Confirmar el pago + crear factura + efectos secundarios

**Confirmación por polling** (no webhook). Motivo: el webhook necesita que MP llegue a nuestro backend por una URL pública; en local no funciona sin un túnel. El polling funciona sin nada extra.

- Mientras se muestra el QR, la app llama cada ~4 s a `POST /api/v1/mercadopago/orders/{id}/confirmar-pago`.
- `MercadoPagoService.confirmarPago` hace `GET {base}/v1/orders/{orderId}`, actualiza el estado de la `Orden`, y decide si está **pagada** (`esPagada`).
- Si está pagada y la comanda **no** fue facturada aún → `FacturaService.generarFacturaPagada(comandaId, TRANSFERENCIA, promocionId)`.

**Cobro en efectivo:** el mozo elige **Efectivo** → **Confirmar pago** → la app llama a `POST /api/v1/facturas/cobrar` con `tipoPago = EFECTIVO`.

**Generación de la factura (común a ambos)** — `FacturaService.generarFacturaPagada`:
1. Resuelve la `FormaDePago` por tipo (`EFECTIVO` / `TRANSFERENCIA`).
2. Reusa `generarDesdeComanda` (idempotente; calcula `total = subtotal − descuento` según promoción; crea los `DetalleFactura`), con estado **`PAGADA`** y fecha de hoy.
3. **Efectos secundarios** (`finalizarComandaYLiberarMesa`): comanda → `FINALIZADA` (+ fecha de entrega), mesa → `LIBRE`.

Al detectar el pago (o tras el cobro en efectivo), la app vuelve a la lista de mesas, donde la mesa ya figura **LIBRE**.

> **Nota (limitación conocida):** la factura se calcula desde la comanda (`subtotal − descuento`). La **propina del 10%** no se factura (es propina, no parte de la factura), aunque el cobro de MP pueda incluirla.

> **Nota técnica (`esPagada`):** los strings de estado que devuelve MP pueden variar. Hoy se considera pagada si el `status` de la order es `processed`/`paid`/`closed`, o si algún pago está `approved`/`processed`. Está en `MercadoPagoService.esPagada` y es fácil de ajustar tras la primera prueba real.

---

## PASO 5 — Flujo post-pago: opción de reseña

Apenas el cobro se concreta (factura generada + efectos del PASO 4 ya aplicados:
comanda `FINALIZADA` + mesa `LIBRE`), la app le pregunta al mozo si el cliente
desea dejar una reseña. Es **común a ambos medios de pago**, porque vive en la
única pantalla de éxito del popup, que solo se muestra tras el éxito del backend
(Efectivo tras `cobrar`; Mercado Pago cuando el polling detecta el pago).

- UI: pantalla de éxito de `src/views/components/pagar/MedioPagoModal.tsx` (estado
  `pagado === true`). Bajo el "✅ Pago registrado" muestra la pregunta
  **"¿El cliente desea dejar una reseña?"** con dos acciones:
  - **Sí, dejar reseña** → callback `onDejarResenia`.
  - **No, gracias** → callback `onOmitirResenia`.
- Navegación (la maneja la pantalla padre `src/app/(mozo)/pagar/[mesaId].tsx`,
  que tiene `mesaId` y `numero`):
  - **Sí** → `router.replace` a `/(mozo)/resenia/[mesaId]` pasando `mesaId` (y
    `numero` para el subtítulo "Mesa X"). Al enviar u omitir la reseña, esa
    pantalla vuelve a `/(mozo)/mesas`.
  - **No** → `router.replace` a `/(mozo)/mesas`.
- Se usa `router.replace` (no `push`) para que el botón atrás no regrese a la
  pantalla de Pagar de una mesa ya cobrada y liberada.

> La pantalla de reseña (`src/app/(mozo)/resenia/[mesaId].tsx`) ya existía; este
> flujo es su primer punto de entrada. Si las rutas tipadas de expo-router marcan
> error en el `pathname`, se regeneran solo al levantar la app (`npm start`).

---

## ▶️ Cómo probarlo

### 0) Requisitos
- **PostgreSQL** corriendo y las variables de entorno del backend: `DB_URL`, `DB_USER`, `DB_PASSWORD`, `SECRET_KEY`.
- Las credenciales de MP ya vienen por defecto (test); no hace falta setearlas salvo que quieras usar otra cuenta (`MP_ACCESS_TOKEN`, `MP_USER_ID`).
- **Conexión a internet** (el backend llama a `api.mercadopago.com`).
- Para el celular: que el `EXPO_PUBLIC_API_URL` de la app apunte al backend (IP de tu PC, no `localhost`, si probás en un teléfono físico).

### 1) Levantar el backend
```bash
cd restaurant-server
mvn spring-boot:run      # corre en http://localhost:8081
# admin por defecto: admin@restaurant.com / 1234
```

### 2) Levantar la app móvil
```bash
cd mobile-app
npm install              # IMPORTANTE: se agregaron dependencias (react-native-svg, react-native-qrcode-svg)
npm start                # Expo
```

### 3) Crear sucursal y caja (PASO 1, una sola vez) — Postman
Importá la colección **`restaurant-server/postman/MercadoPago.postman_collection.json`** (Postman → *Import*). Trae las requests con las URLs/headers/bodies ya armados y captura el token y los ids automáticamente. Corré **en orden**:

1. **1) Login admin** → guarda el `accessToken` (en la colección, login usa `{ "email": "admin@restaurant.com", "clave": "1234" }` y la respuesta es `{ "accessToken": "..." }`).
2. **2) Crear sucursal** → guarda el `id` de la sucursal.
3. **3) Crear caja** → devuelve la caja con su QR.

Si en algún momento **reseteás la base**, corré **6) Sync desde MP** para repoblar sucursal/caja sin recrearlas en MP.

> La colección también incluye **7) Crear order** para probar la creación de una order suelta (devuelve `qrData`).

### 4) Crear una cuenta de prueba **compradora** (para pagar el QR)
El que paga el QR no sos vos (vendedor), es un **usuario de prueba comprador** de Mercado Pago:
1. Panel de MP → **Tus integraciones → (la aplicación) → Cuentas de prueba** → *Crear cuenta de prueba* de tipo **comprador**. Te da un email (`test_user_...@testuser.com`) y contraseña.
2. En un celular, instalá la app de **Mercado Pago** e iniciá sesión con ese usuario comprador. Cargale plata ficticia.
3. (Ese usuario debe ser **distinto** del vendedor dueño del token).

### 5) Probar el flujo completo desde la app del mozo
Logueate como mozo (rol `PERSONAL`), abrí una **mesa con comanda** y entrá a **Pagar**.

**Caso Efectivo:**
1. Ir a Pagar → **Efectivo** → **Confirmar pago**.
2. La app muestra "✅ Pago registrado" y vuelve a mesas.
3. Verificá: factura `PAGADA` / `EFECTIVO` (`GET /api/v1/facturas`), comanda `FINALIZADA`, mesa `LIBRE`.

**Caso Mercado Pago:**
1. Ir a Pagar → **Mercado Pago** → **Generar QR de cobro**.
2. Aparece el QR. Escanealo con la app de MP usando la **cuenta de prueba compradora** y pagá.
3. La app detecta el pago por *polling*, muestra "✅ Pago registrado" y vuelve a mesas.
4. Verificá: factura `PAGADA` / `TRANSFERENCIA`, comanda `FINALIZADA`, mesa `LIBRE`.

### 6) Verificación rápida por API
- `GET /api/v1/mercadopago/orders` → orders creadas (con su `status` / `qrData`).
- `GET /api/v1/facturas` → facturas generadas (estado, forma de pago, total).
- Correr `confirmar-pago` varias veces sobre la misma order **no** duplica la factura (es idempotente).

---

## Pendiente / posibles mejoras
- **Webhook de notificaciones** de MP (para producción, en vez de polling) — requiere URL pública.
- **Cancelar / reembolsar / consultar** order (endpoints `/v1/orders/{id}/cancel`, `/refund`, `GET /v1/orders/{id}`): no implementados.
- **Reusar/cancelar la order previa** de una misma mesa si el mozo genera el QR varias veces (hoy crea una order nueva cada vez).
- **Conciliar la propina** con el monto facturado, si se decidiera incluirla en la factura.
