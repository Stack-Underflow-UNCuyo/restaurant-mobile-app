# Restaurant App — Developer Guide

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 |
| Backend | Spring Boot 3.2 · Java 21 · Spring Security (JWT) · Spring Data JPA |
| Database | PostgreSQL |

---

## Running Locally

### Backend
```bash
cd restaurant-server
# Requires PostgreSQL running and these env vars set:
# DB_URL, DB_USER, DB_PASSWORD, SECRET_KEY
mvn spring-boot:run
# Runs on http://localhost:8081
# Default admin: admin@restaurant.com / 1234
```

### Frontend
```bash
cd dashboard
cp .env.local.example .env.local   # only needed once
npm install
npm run dev
# Runs on http://localhost:3000
```

---

## Frontend Conventions

### Folder structure
```
src/
  app/          # Next.js App Router pages
    (admin)/    # Protected admin pages (sidebar + header layout)
    (full-width-pages)/(auth)/  # Public auth pages
  components/
    direccion/  # Domain-scoped CRUD table components
    ui/         # Generic UI primitives (Modal, Button, DeletionConfirmationPopUp…)
    form/       # Form inputs (Input, Select, Label…)
    common/     # Shared layout helpers (PageBreadcrumb, ComponentCard…)
  context/      # React context providers (Auth, Theme, Sidebar)
  hooks/        # Custom hooks (useModal…)
  icons/        # SVG icon components
  lib/          # Infrastructure (apiClient)
  services/     # One file per domain — all backend calls live here
  types/        # Shared TypeScript interfaces matching API response shapes
```

### Adding a new admin section
1. **Create the page** at `src/app/(admin)/<section>/<entity>/page.tsx`
2. **Create the component** at `src/components/<section>/<Entity>Table.tsx` (see any `direccion/` file as a template)
3. **Register in the sidebar** — add a nav item to the `navItems` array in `src/layout/AppSidebar.tsx`
4. **Add a service** at `src/services/<entity>Service.ts` (see `paisService.ts` as a template)

### CRUD table pattern
Every table component follows the same structure:
- Local state for the list, form data, errors, and `pendingDeleteId`
- Two `useModal()` instances — one for add/edit, one for delete confirmation
- `handleSubmit` validates, then updates local state (backend call goes here when ready)
- Delete uses `<DeletionConfirmationPopUp>` — never a bare `window.confirm`
- Toast on every mutation: `toast.success("... guardado/a")` / `toast.success("... eliminado/a")`

### Shared entity types
API response shapes live in `src/types/entities.ts`.  
Import them with `import type { Pais } from "@/types/entities"`.  
CRUD components that use `<Select>` keep a flat local form type (e.g. `paisId: string`) — this is intentional and separate from the nested API shape.

### API calls
All HTTP calls go through `src/lib/apiClient.ts` (thin fetch wrapper — attaches the JWT automatically).  
Each domain has its own service file in `src/services/`. **No fetch/axios calls inside components.**

### Auth
- JWT stored in the `auth-token` cookie (client-set, SameSite=Lax)
- `useAuth()` from `src/context/AuthContext.tsx` gives you `{ token, login, logout }`
- All admin routes are protected by `src/middleware.ts` — unauthenticated users are redirected to `/signin`

---

## Backend Conventions

### Controller pattern
All controllers extend `BaseController<Entity, Dto, CreateDto, UpdateDto>`, which provides standard CRUD endpoints automatically. New controllers only need to declare the path and wire the service.

### URL structure
- Auth: `/auth/login`
- Domain resources: `/api/v1/<resource>` (plural, lowercase, no accents)

### DTO structure
- `<Entity>Dto` — response shape (full nested objects)
- `<Entity>CreateDto` — request body for POST
- `<Entity>UpdateDto` — request body for PUT

### Adding a new resource
1. Create the `@Entity` class extending `Base`
2. Create the repository extending `JpaRepository`
3. Create `Dto`, `CreateDto`, `UpdateDto` + MapStruct mapper
4. Create the service extending `BaseService`
5. Create the controller extending `BaseController` at `/api/v1/<resource>`
