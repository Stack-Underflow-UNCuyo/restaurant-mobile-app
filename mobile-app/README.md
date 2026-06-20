# Restaurant — Mobile App (Waiters & Kitchen)

Mobile app for restaurant staff, built with **React Native + Expo (SDK 56)** and **expo-router**.
It consumes the Spring Boot backend in [`../restaurant-server`](../restaurant-server).

The app serves two employee roles:

- **Mozo (waiter)** — manage tables (mesas), browse the menu (carta), build an order (comanda),
  and process payment (Mercado Pago).
- **Cocinero (kitchen)** — track and update orders on a Kanban board with state transitions and
  periodic polling.

---

## Tech stack

| Area | Technology |
| ---- | ---------- |
| Framework | Expo SDK 56, React Native 0.85.3, React 19 |
| Routing | expo-router (file-based, typed routes) |
| Data fetching | TanStack React Query (+ AsyncStorage persistence) |
| HTTP | native `fetch` via `src/lib/apiClient.ts` |
| Auth storage | expo-secure-store (encrypted JWT) |
| UI / native | react-native-reanimated, react-native-gesture-handler, react-native-svg, react-native-qrcode-svg |
| Language | TypeScript (strict) |

---

## Requirements

- **Node.js 18+**
- **Expo Go** app on a physical device, or an Android/iOS emulator
- The [backend](../restaurant-server) running on port **8081**

---

## Environment variables

Configured in `.env` (copy from `.env.example`). A single variable is needed:

```env
EXPO_PUBLIC_API_URL=http://localhost:8081
```

`localhost` from a phone/emulator does **not** point to your PC, so set the URL according to your
environment:

| Environment | URL |
| ----------- | --- |
| Android emulator | `http://10.0.2.2:8081` |
| Physical device (Expo Go) | `http://<your-PC-LAN-IP>:8081` (e.g. `http://192.168.0.10:8081`) |
| iOS simulator / Web | `http://localhost:8081` |

---

## Run

```bash
cd mobile-app
cp .env.example .env     # adjust EXPO_PUBLIC_API_URL for your environment (see above)
npm install              # first time only
npm start                # starts the Expo dev server (port 19000)
```

Then:

| Command | Target |
| ------- | ------ |
| `npm run android` | Android emulator / device |
| `npm run ios` | iOS simulator |
| `npm run web` | Browser (React Native Web) |
| `npm start` | Dev server — scan the QR with Expo Go |

> Make sure the backend is running (`cd restaurant-server && ./mvnw spring-boot:run`).

Linting:

```bash
npm run lint
```

---

## How login resolves the role

The backend JWT only carries the generic role (`ROLE_ADMIN` / `ROLE_PERSONAL`), **not** the employee
type. After authenticating, the app resolves whether the user is a waiter or kitchen staff:

1. `POST /auth/login` with `{ email, clave }` → `{ accessToken }`
2. Decode the JWT → `sub` (user id), `e` (email), `a` (roles)
3. `GET /api/v1/usuarios/{id}` → `personaId`
4. `GET /api/v1/empleados/{personaId}` → `tipoEmpleado` (`MOZO` / `COCINERO`)

If the employee is neither a waiter nor kitchen staff (e.g. administrative), access is rejected.
The token is stored encrypted with `expo-secure-store`, and the session is restored on app relaunch.

---

## Project structure

```
src/
  app/              # Routes (expo-router, file-based)
    _layout.tsx     #   root layout: AuthProvider + AuthGate (role-based redirect)
    login.tsx       #   login screen
    (mozo)/         #   waiter route group
    (cocinero)/     #   kitchen route group
  views/            # UI layer — components/ (by feature) and constants/ (config, theme)
  controllers/      # context/ (AuthContext, CartContext) and hooks/ (e.g. useKanban)
  models/           # services/ (API integration) and types/ (domain types)
  lib/              # apiClient (fetch + JWT), queryClient (React Query), tokenStorage (SecureStore)
```

### Conventions

- **No loose `fetch` in screens** — every request goes through `src/lib/apiClient.ts` and the
  services in `src/models/services/`.
- Session state is accessed with `useAuth()` (`{ user, token, login, logout }`).
- New screens for each role go inside their group: `(mozo)/` or `(cocinero)/`.
- Role-based redirection is handled by the `AuthGate` in `src/app/_layout.tsx`; no need to repeat
  guards in every screen.
