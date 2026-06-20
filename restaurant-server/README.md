# Restaurant Server (Spring Boot API)

REST API that powers the entire platform — the [mobile app](../mobile-app), the
[admin dashboard](../dashboard) and the [public web menu](../carta-web).

It exposes ~40 controllers under `/api/v1/*`, with JWT authentication, Mercado Pago payment
integration and image uploads. Runs on **http://localhost:8081**.

---

## Tech stack

| Area | Technology |
| ---- | ---------- |
| Language | Java 21 |
| Framework | Spring Boot 3.2.5 (Web, Data JPA, Security, Validation) |
| Database | PostgreSQL (production) · H2 in-memory (tests) |
| ORM | Hibernate / Spring Data JPA |
| Auth | JWT — Auth0 `java-jwt` 4.4.0 |
| Mapping | MapStruct 1.5.3 |
| Boilerplate | Lombok |
| API docs | springdoc-openapi (Swagger UI) |
| Config | spring-dotenv (`.env` support) |
| Build | Maven (with bundled `mvnw` / `mvnw.cmd` wrapper) |

---

## Requirements

| Tool | Version |
| ---- | ------- |
| Java | 21 |
| Maven | 3.8+ (or use the bundled `mvnw` / `mvnw.cmd`) |
| PostgreSQL | 15+ |

---

## Setup

### 1. Create the database

```sql
CREATE DATABASE restaurant;
```

### 2. Environment variables

All variables are read in [`src/main/resources/application.properties`](./src/main/resources/application.properties)
and fall back to the defaults below if unset, so the server can boot with just a local PostgreSQL.
Override them for your environment (set a strong `SECRET_KEY` of at least 32 characters).

| Variable | Maps to | Default |
| -------- | ------- | ------- |
| `DB_URL` | `spring.datasource.url` | `jdbc:postgresql://localhost:5432/restaurant` |
| `DB_USER` | `spring.datasource.username` | `postgres` |
| `DB_PASSWORD` | `spring.datasource.password` | `postgres` |
| `SECRET_KEY` | `security.jwt.secret-key` | `dev-secret-key-at-least-32-chars-long!!` |
| `MP_ACCESS_TOKEN` | `mercado-pago.access-token` | (test token) |
| `MP_USER_ID` | `mercado-pago.user-id` | (test user id) |

Set them in your shell before running:

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

---

## Run

```bash
# Linux / macOS
./mvnw spring-boot:run

# Windows
mvn spring-boot:run
```

The server starts on **http://localhost:8081**. The schema is created/updated automatically
(`spring.jpa.hibernate.ddl-auto=update`), and on the first boot the database is populated with
seed data (locations, menu, tables, payment methods) and a set of default accounts.

### Default accounts

| Role | Email | Password |
| ---- | ----- | -------- |
| Admin | `admin@restaurant.com` | `1234` |
| Waiter (Mozo) | `mozo@restaurant.com` | `1234` |
| Kitchen (Cocinero) | `cocinero@restaurant.com` | `1234` |

---

## API documentation

Once running, the interactive Swagger UI is available at:

```
http://localhost:8081/swagger-ui.html
```

---

## Tests

```bash
./mvnw test
```

Tests run against an in-memory **H2** database — no environment variables or running PostgreSQL
required.

---

## Image uploads

Uploaded images are stored in the [`uploads/`](./uploads) folder and served back at `/images/**`
(configured in `config/WebConfig`).

---

## Project structure

Base package: `com.cm.restaurant_server`

```
src/main/java/com/cm/restaurant_server/
├── controllers/          # ~40 REST controllers (+ exception handler)
├── business/
│   ├── domain/
│   │   ├── entity/        # JPA entities
│   │   ├── dto/           # request/response DTOs
│   │   └── enumeration/   # Rol, EstadoComanda, EstadoMesa, TipoPago, ...
│   ├── logic/service/     # business services
│   ├── repository/        # Spring Data JPA repositories
│   └── mapper/            # MapStruct mappers (DTO ↔ entity)
├── security/             # JWT issuing/decoding, filters, user details
├── config/               # WebConfig (images), MercadoPagoConfig
└── RestaurantServerApplication.java  # entry point + data seeding
```

