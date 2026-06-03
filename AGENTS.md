# AGENTS.md — Restaurant App

**Read [`CLAUDE.md`](./CLAUDE.md) first** for conventions (folder structure, CRUD patterns, backend resource workflow). This file adds what CLAUDE.md omits.

## Two-package monorepo

| Dir | Stack | Port |
|---|---|---|
| `restaurant-server/` | Spring Boot 3.2 · Java 21 · Maven | 8081 |
| `dashboard/` | Next.js 16 · React 19 · TS 5.9 · Tailwind CSS v4 | 3000 |

## Commands

```bash
# Start database (PostgreSQL 15)
docker compose up -d

# Stop database
docker compose down

# Backend — run (env vars optional — defaults match docker compose)
cd restaurant-server && mvn spring-boot:run

# Backend — test (uses H2, no env vars or database needed)
cd restaurant-server && mvn test

# Frontend — first-time setup
cd dashboard && cp .env.local.example .env.local && npm install

# Frontend — dev
cd dashboard && npm run dev

# Frontend — lint only (no test framework installed)
cd dashboard && npm run lint

# Frontend — typecheck (no dedicated script; use build or tsc --noEmit)
cd dashboard && npm run build
# or: cd dashboard && npx tsc --noEmit
```

## Auth

- POST `/auth/login` body `{ email, clave }` → `{ accessToken }`
- Token stored in cookie `auth-token` (max-age 86400, SameSite=Lax)
- Default admin: `admin@restaurant.com` / `1234` (auto-created on first boot)
- `useAuth()` from `@/context/AuthContext` gives `{ token, user, login, logout }`
- Frontend middleware redirects unauthenticated → `/signin`

## Backend quirks

- `spring.jpa.hibernate.ddl-auto=update` — **no Flyway/Liquibase**; schema comes from entities
- MapStruct mappers + Lombok via Maven annotation processor (see `pom.xml`)
- All controllers extend `BaseController<Entity, Dto, CreateDto, UpdateDto>` → standard CRUD at `/api/v1/<resource>`
- Services use Spanish naming: `buscarPorEmail`, `crear`, `findAll`, etc.
- Swagger at `/swagger-ui.html` (via `springdoc-openapi`)
- Tests: H2 in-memory DB, `@SpringBootTest`

## Frontend quirks

- **No test framework** (no Jest, Vitest, Playwright, etc.)
- SVGs imported as React components via `@svgr/webpack` (configured in `next.config.ts` for both webpack and Turbopack)
- `@/*` path alias maps to `./src/*` (see `tsconfig.json`)
- Tailwind CSS v4 via `@tailwindcss/postcss` in `postcss.config.js` (not the old `tailwind.config.js`)
- Prettier with `prettier-plugin-tailwindcss` for class sorting
- App name `"Aromas de Viña"` and description in `src/lib/constants.ts`
- Sidebar `navItems` in `src/layout/AppSidebar.tsx`
- ESLint: `eslint-config-next` with `core-web-vitals` + TypeScript rules

## Important conventions

- No `fetch`/`axios` in components — use `apiClient` from `@/lib/apiClient` (auto-attaches JWT)
- Every mutation calls `toast.success("... guardado/a")` / `toast.error("...")` via `react-hot-toast`
- Delete confirmation uses `<DeletionConfirmationPopUp>` — never `window.confirm`
- Use `useModal()` from `@/hooks/useModal`; two instances per CRUD table (one for form, one for delete)
- Select components use flat local form types (e.g. `paisId: string`) separate from nested API types
- `types/entities.ts` has shared interfaces; type files per domain exist but some are unused/unmaintained
