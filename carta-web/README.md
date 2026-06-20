# Restaurant — Public Web Menu (Carta)

Public-facing digital menu (carta) for the restaurant, meant to be opened from a web link or a QR
code. It is **read-only and requires no login**. Built with Next.js and consumes the Spring Boot
backend in [`../restaurant-server`](../restaurant-server).

Runs on **http://localhost:3000**.

---

## Pages

| Route | Description |
| ----- | ----------- |
| `/` | Home — company name + list of published cartas |
| `/carta/[cartaId]` | A carta with its sections |
| `/carta/[cartaId]/menu` | Menu preview grouped by section |
| `/seccion/[id]` | All items (dishes / menus) within a section |

---

## Tech stack

| Area | Technology |
| ---- | ---------- |
| Framework | Next.js 16.1.6 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS v4 |
| Typography | Google Fonts — Outfit + Fraunces |
| HTTP | lightweight fetch client `src/lib/apiClient.ts` (public GETs only) |
| Language | TypeScript (strict) |

---

## Requirements

- **Node.js 18+**
- The [backend](../restaurant-server) running on port **8081**

---

## Environment variables

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:8081
```

The app fetches `/api/v1/cartas` and `/api/v1/empresas`, and loads images from `/images/...` on the
backend.

---

## Run

```bash
cd carta-web
npm install
npm run dev              # http://localhost:3000
```

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start the dev server (Turbopack) on port 3000 |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |

> **Port note:** carta-web and the [dashboard](../dashboard) both default to port 3000. To run both
> at once, start one of them on a different port, e.g. `npm run dev -- -p 3001`.
