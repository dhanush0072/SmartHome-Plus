# SmartHome+ Backend

Java 21 / Spring Boot 3.5.6 REST API for the existing React + Vite frontend. The API runs at `http://localhost:8080/api`; the development CORS origin defaults to `http://localhost:8443`.

## Run

The Maven Wrapper is included; no global Maven installation is needed. Set the environment variables below in the same terminal before running the application. Spring does not automatically load `.env` files.

Required variables:

- `DB_USERNAME` and `DB_PASSWORD`: a MySQL account with access to `smarthome_db`.
- `JWT_SECRET`: Base64 encoding of at least 32 cryptographically random bytes.

Optional variables are `DB_URL`, `JWT_TTL_SECONDS` (default `900`), and `FRONTEND_ORIGIN` (default `http://localhost:8443`). `.env.example` contains placeholders only; do not put real credentials in it.

Once the database has been verified and credentials are configured:

```powershell
.\mvnw.cmd spring-boot:run
```

Flyway applies versioned migrations at startup. The configured MySQL database must exist before the application starts; migrations create and update its tables. Hibernate validates the migration schema and does not create tables itself.

## Test and Build

```powershell
.\mvnw.cmd test
.\mvnw.cmd package
```

Tests use an isolated in-memory H2 database and run the Flyway migrations; they do not need MySQL credentials.

## Authentication

Register at `POST /auth/register`, sign in at `POST /auth/login`, and send the returned access token as `Authorization: Bearer <token>`. `GET /auth/me` and `GET /users/me` return the current profile. Passwords are BCrypt hashes. Tokens are stateless, expire after 15 minutes by default, and are not revoked on logout; `POST /auth/logout` returns `204`, and clients must discard the token. There are no refresh tokens.

New accounts always receive the `USER` role. Admin endpoints require `ADMIN`; no default administrator is provisioned. Promote an account only through a trusted database administrator process after verifying the account identity. Admin responses never include password hashes.

## API Areas

- `/auth`: registration, login, current user, stateless logout
- `/users/me`: profile and settings
- `/rooms`: room CRUD
- `/devices`: list/create and simulated state updates
- `/dashboard`: account summary counts and recent energy usage
- `/automation`: rule CRUD
- `/security`: status and event history
- `/energy`: records and 30-day summary
- `/notifications`: list and mark as read
- `/feedback`: create and list current user's feedback
- `/admin`: role-protected overview and paginated user summaries