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

The backend is designed as a **monolithic web server for the MVP**, with a clear path to service separation as the platform grows.

### MVP (monolithic)

A single Rust binary handles HTTP, WebSocket, and execution:

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

**Monolithic trade-offs (accepted for MVP):**
- If API server is busy with a long execution, other HTTP requests are handled via Tokio async concurrency
- Resource contention between HTTP handling and Docker orchestration in the same process
- Single point of failure (one process does everything)
- Scaling requires duplicating the entire binary (can't scale workers independently)

### Post-MVP: Separated services

When scaling requires it, the monolith splits into independent services:

```
┌─────────────┐   ┌──────────────┐   ┌──────────────┐
│   API       │   │  Worker Pool  │   │  Scheduler   │
│   Server    │   │  (execution)  │   │  (cron)      │
│             │   │              │   │              │
│ • Auth      │   │ • Docker     │   │ • Scheduled  │
│ • Projects  │   │   lifecycle  │   │   executions │
│ • Rate      │   │ • Log stream │   │ • Webhook    │
│   limits    │   │ • Output     │   │   triggers   │
│             │   │   capture    │   │              │
└──────┬──────┘   └──────┬───────┘   └──────┬───────┘
       │                 │                   │
       └─────────────────┼───────────────────┘
                         ▼
                 ┌──────────────┐
                 │    Redis     │
                 │ (queue/pub)  │
                 └──────────────┘
```

Each service independently deployable and scalable. Communication via Redis pub/sub and a shared PostgreSQL database.

## API design

- RESTful where natural (projects, auth)
- WebSocket for streaming execution output
- JSON request/response bodies
- JWT for authenticated sessions
- Rate limiting headers on all public endpoints
