# Backend

## Stack

| Layer | Technology |
|---|---|
| Language | Rust |
| HTTP Framework | Axum |
| Runtime | Tokio |
| Database | SQLx (PostgreSQL) |
| Cache | Redis |
| Container Runtime | Docker (via bollard crate) |

## Why Rust?

- **Performance** — container lifecycle operations are I/O-heavy; Rust handles concurrency efficiently with Tokio
- **Safety** — memory safety without a GC means predictable resource usage under load
- **Ecosystem** — Axum + Tokio + SQLx is a proven stack for web services
- **Startup time** — Rust binaries start fast, important for a service that boots containers on demand

## Service structure

The backend is a **monolithic web server** with clearly separated modules:

```
src/
├── main.rs           -- entrypoint, server bootstrap
├── routes/           -- Axum route handlers
│   ├── execution.rs  -- POST /run, GET /run/:id
│   ├── projects.rs   -- CRUD for saved projects
│   ├── auth.rs       -- registration, login, sessions
│   └── admin.rs      -- admin endpoints (rate limits, logs)
├── services/         -- business logic
│   ├── executor.rs   -- Docker container lifecycle
│   ├── queue.rs      -- execution queue + Redis pub/sub
│   ├── auth.rs       -- JWT/session management
│   └── billing.rs    -- ad serving / premium checks
├── db/               -- SQLx migrations and queries
├── models/           -- shared structs and enums
└── config.rs         -- environment-based config
```

## API design

- RESTful where natural (projects, auth)
- WebSocket for streaming execution output
- JSON request/response bodies
- JWT for authenticated sessions
- Rate limiting headers on all public endpoints
