# Finance Dashboard Backend

A backend system for a finance dashboard where different users interact with financial records based on their role. Built with Express, TypeScript, Prisma, and PostgreSQL (Supabase).

---

## Tech Stack

- **Runtime** — Node.js
- **Language** — TypeScript
- **Framework** — Express
- **ORM** — Prisma v7
- **Database** — PostgreSQL via Supabase
- **Auth** — JWT (jsonwebtoken)
- **Password Hashing** — bcrypt
- **Validation** — Custom middleware

---

## Project Structure

```
src/
  config/          → environment variables and server config
  controllers/     → handles request and response
  middlewares/     → auth, role checking, input validation
  repositories/    → all database queries via Prisma
  services/        → business logic
  lib/             → single Prisma client instance
  utils/           → error classes, response helpers
  prisma/
    schema.prisma  → database schema
    migrations/    → migration history
    seed.ts → seeding database
generated/
  prisma/          → generated Prisma client
prisma.config.ts   → Prisma v7 config file
.env               → environment variables
```

The flow for every request is:

```
Request → Route → Middleware → Controller → Service → Repository → Database
```

Each layer has one responsibility. Controllers never touch the database directly. Services never handle HTTP. This separation made the code easier to debug and extend.

---

## Setup

### Prerequisites

- Node.js v18+
- A Supabase account (free tier works)

### Steps

```bash
# 1. Clone the repo
git clone <repo-url>
cd zorvyn

# 2. Install dependencies
npm install

# 3. Create .env at the root
touch .env
```

Add the following to your `.env`:

```env
DATABASE_URL="postgresql://postgres:yourpassword@db.yourproject.supabase.co:5432/postgres"
PORT=3000
JWT_SECRET="your_jwt_secret"
JWT_EXPIRY="24h"
SALT_ROUNDS=10
```

```bash
# 4. Run migrations
npx prisma migrate dev

# 5. Seed the admin user
npx ts-node src/prisma/seed.ts

# 6. Build and start
npm run build
npm start

# or for development
npm run dev
```

---

## Roles

| Role | Permissions |
|---|---|
| VIEWER | View financial records and dashboard |
| ANALYST | View records and access all dashboard insights |
| ADMIN | Full access — manage records and users |

Every new user who signs up is assigned `VIEWER` by default. The first admin is created via the seed script. Only an admin can change someone's role.

---

## API Endpoints

### Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/v1/auth/signup` | Public | Create a new user |
| POST | `/api/v1/auth/signin` | Public | Sign in and get JWT token |

**Signup body:**
```json
{
  "userName": "Jagpreet",
  "email": "jagpreet@gmail.com",
  "password": "securepassword"
}
```

**Signin body:**
```json
{
  "email": "jagpreet@gmail.com",
  "password": "securepassword"
}
```

---

### User Management

All routes below require `Authorization: Bearer <token>` header.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/v1/users` | ADMIN | Get all users |
| GET | `/api/v1/users/:id` | All roles | Get a single user |
| PATCH | `/api/v1/users/:id/role` | ADMIN | Update user role |
| PATCH | `/api/v1/users/:id/status` | ADMIN | Activate or deactivate user |

**Update role body:**
```json
{
  "role": "ANALYST"
}
```

**Update status body:**
```json
{
  "status": "INACTIVE"
}
```

---

### Financial Records

All routes require auth token. Create, update, delete are restricted to ADMIN only.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/v1/records` | ADMIN | Create a record |
| GET | `/api/v1/records` | All roles | Get all records |
| GET | `/api/v1/records/:id` | All roles | Get a single record |
| PUT | `/api/v1/records/:id` | ADMIN | Update a record |
| DELETE | `/api/v1/records/:id` | ADMIN | Delete a record |
| GET | `/api/v1/records/filter` | ANALYST, ADMIN | Filter records |

**Create record body:**
```json
{
  "amount": 5000,
  "type": "INCOME",
  "category": "salary",
  "date": "2024-01-15",
  "description": "Monthly salary"
}
```

**Filter query params:**
```
GET /api/records/filter?type=INCOME&category=salary&startDate=2024-01-01&endDate=2024-03-31
```

---

### Dashboard

All routes require auth. ANALYST and ADMIN only.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/dashboard/summary` | Total income, expenses, net balance |
| GET | `/api/v1/dashboard/category-totals` | Category wise breakdown |
| GET | `/api/v1/dashboard/recent-activity` | Last 10 records |
| GET | `/api/v1/dashboard/monthly-trends` | Month wise income and expense totals |

**Sample summary response:**
```json
{
  "success": true,
  "message": "Summary fetched successfully",
  "data": {
    "totalIncome": 50000,
    "totalExpense": 20000,
    "netBalance": 30000
  }
}
```

---

## Authentication Flow

1. User signs in and receives a JWT token
2. Token is sent in the `Authorization` header as `Bearer <token>`
3. `checkAuth` middleware verifies the token and fetches the user from DB
4. User object is attached to `req.user` — available in all subsequent middleware and controllers
5. `restrictTo(...roles)` middleware checks `req.user.role` and allows or blocks the request

---

## Assumptions Made

- Every new user starts as `VIEWER` — role is never accepted from the request body
- The first admin is created via a seed script, not through the API
- `createdById` on a financial record is always taken from `req.user.id` — never from the request body
- Soft delete was not implemented — delete is permanent
- Pagination was not added to keep the scope focused on core requirements

---

## Tradeoffs Considered

**Enum vs separate Role model**
I used an enum for roles instead of a separate `Role` table. Since roles are fixed by the system and not created dynamically at runtime, an enum is simpler, enforced at the schema level, and requires no joins. A separate model would only make sense if admins needed to create custom roles.

**Single Prisma instance via globalThis**
In development, every server reload would create a new Prisma client and eventually exhaust database connections. Attaching the instance to `globalThis` solves this without any extra tooling.

**Dashboard queries directly in service**
For dashboard aggregations I used Prisma directly in the service layer instead of going through the repository. The base `CrudRepository` only handles standard CRUD — aggregation queries like `groupBy` and `aggregate` are one-off operations specific to the dashboard and do not belong in a generic repository.

**Fresh response objects instead of shared ones**
Initially I used shared `SuccessResponse` and `ErrorResponse` objects exported as constants and mutated them per request. This works fine for single requests but is a race condition risk under concurrent load since all requests share the same object in memory. Replaced them with helper functions that return a fresh object each time.

**Monthly trends calculated in JavaScript not SQL**
Grouping by exact datetime in Prisma would create a separate group for every unique timestamp. Instead, records are fetched and grouped by year-month (`"2024-01"`) in JavaScript using `reduce`. This keeps the query simple and gives clean monthly buckets.

---

## Errors I Faced and How I Fixed Them

**`Cannot find module './config'`**
The compiled `index.js` was being run from inside `src/` instead of from the project root. The `outDir` in `tsconfig.json` was commented out so compiled files were being placed next to source files. Fixed by setting `rootDir: ./src` and `outDir: ./dist` and always running from the project root.

**`DATABASE_URL` returning undefined**
The `.env` file was inside `src/` because Prisma generated it there. `dotenv` looks for `.env` at the project root by default. Moved everything to a single `.env` at the root — Prisma also picks up `DATABASE_URL` from there automatically.

**JWT `expiresIn` type error**
TypeScript expects `expiresIn` to be of type `StringValue` from the `ms` package, not a plain `string`. Fixed by casting it as `SignOptions['expiresIn']` directly in `ServerConfig`.

**Prisma config not being picked up**
`prisma.config.ts` was inside `src/` but Prisma looks for it at the project root. Moving it to the root fixed the issue. Also had to explicitly set the schema path inside the config since it was not in the default location.

**`updatedById` named relation conflict**
Having two relations from `FinancialRecord` to `User` (creator and updater) caused a Prisma ambiguity error. Fixed by using named relations — `@relation("RecordCreator")` and `@relation("RecordUpdater")` — on both sides of each relation.

**`PrismaClient` initialization error with Prisma v7**
When running the seed script, Prisma threw a `PrismaClientInitializationError` saying 
the client needs to be constructed with valid options. Initially tried passing 
`datasourceUrl` directly to `PrismaClient` but it did not work as expected with 
Prisma v7 and Supabase. The fix was to use a driver adapter — created a connection 
pool using `pg` and passed it as an adapter object to `PrismaClient`. Prisma v7 
separates the CLI config (`prisma.config.ts`) from the runtime client, meaning the 
client does not read the config file at runtime and needs the connection handled 
explicitly through an adapter.

---

