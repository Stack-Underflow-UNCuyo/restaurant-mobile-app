# Restaurant App

Full-stack restaurant management system centered around a mobile application built with React Native, designed for real-time restaurant operations.

The mobile app allows waiters to manage tables, handle orders, and process payments, while kitchen staff can track and update orders through a Kitchen Kanban Board, improving workflow and coordination.

Additionally, the system includes a Next.js dashboard for administration and a Spring Boot REST API that powers the entire platform.

### Menu and Tables
<p align="center">
  <img width="246" height="520" alt="Captura de pantalla 2026-06-16 154321" src="https://github.com/user-attachments/assets/6080f113-3453-4757-a684-16ac5e063f5a" />
  <img width="242" height="531" alt="Captura de pantalla 2026-06-16 154258" src="https://github.com/user-attachments/assets/44991b80-57db-4de8-821c-1459504efdc9" />
</p>

### Order Management Board

<p align="center">
  <img width="611" height="816" alt="Captura de pantalla 2026-06-16 154746" src="https://github.com/user-attachments/assets/fb59e978-30de-42ac-a91b-ef7a492ede56" />
</p>


### Dashboard

<p align="center">
  <img width="1918" height="884" alt="Captura de pantalla 2026-06-16 153707" src="https://github.com/user-attachments/assets/fd80f468-7795-41ab-83bc-060705617735" />
</p>



---

## Prerequisites

| Tool       | Version |
| ---------- | ------- |
| Java       | 21      |
| Maven      | 3.8+    |
| Node.js    | 18+     |
| PostgreSQL | 15+     |

---

## Backend (Spring Boot)

### 1. Create the database

```sql
CREATE DATABASE restaurant;
```

### 2. Set environment variables

Set the following variables in your shell before running the server.

**PowerShell:**

```powershell
$env:DB_URL      = "jdbc:postgresql://localhost:5432/restaurant"
$env:DB_USER     = "postgres"
$env:DB_PASSWORD = "yourpassword"
$env:SECRET_KEY  = "any-long-random-string-at-least-32-chars"
```

**Bash / zsh:**

```bash
export DB_URL="jdbc:postgresql://localhost:5432/restaurant"
export DB_USER="postgres"
export DB_PASSWORD="yourpassword"
export SECRET_KEY="any-long-random-string-at-least-32-chars"
```

### 3. Run

```bash
cd restaurant-server
mvn spring-boot:run
```

The server starts on **http://localhost:8081**.  
On first boot a default admin account is created automatically:

| Field    | Value                |
| -------- | -------------------- |
| Email    | admin@restaurant.com |
| Password | 1234                 |

## Frontend (Next.js)

### 1. Install dependencies

```bash
cd dashboard
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` if the backend runs on a different host or port:

```env
NEXT_PUBLIC_API_URL=http://localhost:8081
```

### 3. Run

```bash
npm run dev
```

The dashboard starts on **http://localhost:3000** and redirects to `/signin` until you log in.

---

## Running tests

### Backend

```bash
cd restaurant-server
mvn test
```

Tests run against an in-memory H2 database — no environment variables or running PostgreSQL required.

---

## Project structure

```
restaurant-mobile-app/
├── restaurant-server/   # Spring Boot API
└── dashboard/           # Next.js admin dashboard
```

See [CLAUDE.md](./CLAUDE.md) for architecture decisions, folder conventions, and patterns to follow when adding new features.
