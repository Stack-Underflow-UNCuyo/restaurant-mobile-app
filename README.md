# Restaurant App

Full-stack restaurant management system with a Next.js dashboard and a Spring Boot REST API.

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
