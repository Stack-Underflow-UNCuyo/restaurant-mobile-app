# Restaurant — App Móvil (Mozos y Cocineros)

App móvil del restaurante, hecha con **React Native + Expo (SDK 56)** y **expo-router**.
Consume el backend Spring que vive en `../restaurant-server`.

Por ahora implementa el **login** para los dos roles de empleado: **Mozo** y **Cocinero**.

---

## Cómo correrla

```bash
cd mobile-app
cp .env.example .env     # ajustá EXPO_PUBLIC_API_URL según tu entorno (ver abajo)
npm install              # solo la primera vez
npm start                # abre el dev server de Expo
# luego: 'a' para Android, 'w' para web, o escaneá el QR con Expo Go
```

### URL del backend (`EXPO_PUBLIC_API_URL` en `.env`)

El backend corre en `http://localhost:8081`, pero "localhost" desde el teléfono/emulador
no apunta a tu PC. Usá según el caso:

| Entorno                         | URL                              |
| ------------------------------- | -------------------------------- |
| Emulador Android                | `http://10.0.2.2:8081`           |
| Dispositivo físico (Expo Go)    | `http://<IP-LAN-de-tu-PC>:8081`  |
| iOS simulator / Web             | `http://localhost:8081`          |

> Asegurate de tener el backend corriendo (`cd restaurant-server && mvn spring-boot:run`).

---

## Cómo funciona el login

El JWT del backend solo trae el rol genérico (`ROLE_ADMIN` / `ROLE_PERSONAL`), **no** el tipo
de empleado. Por eso, tras autenticar, la app resuelve si es Mozo o Cocinero:

1. `POST /auth/login` con `{ email, clave }` → `{ accessToken }`
2. Se decodifica el JWT → `sub` (id usuario), `e` (email), `a` (roles)
3. `GET /api/v1/usuarios/{id}` → `personaId`
4. `GET /api/v1/empleados/{personaId}` → `tipoEmpleado` (`MOZO` / `COCINERO`)

Si el empleado no es Mozo ni Cocinero (ej. administrativo), se rechaza el acceso.
El token se guarda cifrado con `expo-secure-store` y la sesión se restaura al reabrir la app.

---

## Estructura

```
src/
  app/                  # Rutas (expo-router, file-based)
    _layout.tsx         #   layout raíz: AuthProvider + AuthGate (redirección por rol)
    index.tsx           #   entrada (spinner mientras se decide el destino)
    login.tsx           #   pantalla de login
    (mozo)/             #   grupo de rutas del mozo
      _layout.tsx
      index.tsx         #     home del mozo (placeholder)
    (cocinero)/         #   grupo de rutas del cocinero
      _layout.tsx
      index.tsx         #     home del cocinero (placeholder)
  components/           # UI reutilizable (themed-text, themed-view, role-home)
  constants/            # config (API_URL), theme
  context/              # AuthContext (estado de sesión global)
  hooks/                # useTheme, useColorScheme
  lib/                  # apiClient (fetch + JWT), tokenStorage (SecureStore)
  services/             # authService (login + resolución de rol)
  types/                # tipos del dominio (auth)
```

### Convenciones

- **Nada de `fetch` suelto en pantallas** — todo pasa por `src/lib/apiClient.ts` y los servicios de `src/services/`.
- El estado de sesión se accede con `useAuth()` (`{ user, token, login, logout }`).
- Las pantallas nuevas de cada rol se agregan dentro de su grupo: `(mozo)/` o `(cocinero)/`.
- La redirección por rol la maneja el `AuthGate` en `src/app/_layout.tsx`; no hace falta repetir guards en cada pantalla.

---

## Próximos pasos

- Pantallas funcionales del mozo (mesas, comandas).
- Pantallas funcionales del cocinero (comandas pendientes).
- Manejo de refresco/expiración de token.
