# Restaurant — Admin Dashboard

Next.js admin panel for restaurant administration. It consumes the Spring Boot backend in
[`../restaurant-server`](../restaurant-server) and runs on **http://localhost:3000**.

Built on top of the [TailAdmin](https://tailadmin.com) template (MIT).

---

## Features

- **Statistics** — revenue cards, monthly income chart, customer reviews summary, and a
  payment-method breakdown. Stats are computed in the frontend from `GET /api/v1/facturas` and
  `GET /api/v1/resenias` (see [`estadisticas.md`](./estadisticas.md)).
- **Menus / Cartas** — manage cartas, sections, menus and categories.
- **Invoicing** — invoices (facturas), payment methods, promotions.
- **Inventory** — articles, stock, stock movements, units of measure.
- **Restaurant operations** — tables (mesas), orders (comandas), reviews (reseñas).
- **Users & admin** — list and create users.
- **Location data** — countries, provinces, departments, localities, addresses.
- **Company settings** — restaurant profile.

---

## Tech stack

| Area | Technology |
| ---- | ---------- |
| Framework | Next.js 16.1.6 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS v4 |
| Charts & widgets | ApexCharts, FullCalendar, jVectorMap |
| UX | react-hot-toast, react-dnd, react-dropzone, swiper, flatpickr |
| Auth | JWT stored in a cookie (`AuthContext`) |
| Language | TypeScript (strict) |

---

## Requirements

- **Node.js 18+** (20+ recommended)
- The [backend](../restaurant-server) running on port **8081**

---

## Environment variables

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:8081
```

Point it at your backend host/port if different.

---

## Run

```bash
cd dashboard
npm install              # use --legacy-peer-deps if you hit a peer-dependency error
npm run dev              # http://localhost:3000
```

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start the dev server (Turbopack) on port 3000 |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |

The app redirects to `/signin` until you log in. Use the backend admin account
(`admin@restaurant.com` / `1234`).

> **Port note:** the dashboard and [carta-web](../carta-web) both default to port 3000. To run both
> at once, start one of them on a different port, e.g. `npm run dev -- -p 3001`.
