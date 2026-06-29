# System Overview

## High-level architecture

```
                     ┌──────────────┐
                     │  Browser     │
                     │  (Next.js)   │
                     └──────┬───────┘
                            │ HTTP / WS
                            ▼
                     ┌──────────────┐
                     │   Nginx      │
                     │  (reverse    │
                     │   proxy)     │
                     └──────┬───────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
       ┌──────────┐  ┌──────────┐  ┌──────────┐
       │  Auth    │  │ Executor │  │  Admin   │
       │  Routes  │  │  Routes  │  │  Routes  │
       └──────────┘  └────┬─────┘  └──────────┘
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
       ┌──────────┐ ┌─────────┐ ┌──────────┐
       │  Queue   │ │ Docker  │ │   WS     │
       │ (Redis)  │ │ Daemon  │ │ Streamer │
       └──────────┘ └─────────┘ └──────────┘
```

## Components

### Frontend (Next.js)

Serves the UI, handles user input, and renders execution output. Talks to the backend via REST and WebSocket.

### API Server (Rust/Axum)

The core of the platform. Handles authentication, project CRUD, execution requests, and admin controls.

### Container Orchestrator

A service module within the API server that manages the Docker container lifecycle: pull → create → start → stream → cleanup.

### Execution Queue

Redis-backed FIFO queue. When the system is under load, execution requests are queued and processed sequentially per user (or globally for guests).

### Database (PostgreSQL)

Persistent storage for users, projects, and execution history.

## Planned service separation (post-MVP)

The monolithic architecture is sufficient for the MVP but carries risks:

| Risk | Impact | Mitigation in MVP | Post-MVP solution |
|---|---|---|---|
| API server blocked by execution | Slow HTTP responses during heavy container work | Tokio async concurrency; queue-based execution | Separate worker processes |
| Single point of failure | One crash takes down the entire platform | Restart policy (systemd, Docker restart) | Independent services with health checks |
| Can't scale workers independently | Must duplicate entire binary to scale execution capacity | N/A — acceptable at low scale | Worker pool with autoscaling |
| Resource contention | HTTP handling competes with Docker operations for CPU/memory | cgroup prioritization; request queuing | Dedicated worker machines |

**Post-MVP architecture:**

```
Browser ───▶ API Server ──▶ Redis Queue ──▶ Worker Pool ──▶ Docker
                 │                                              │
                 └──── WebSocket ──▶ Browser ◀─── Log stream ──┘
```

- **API Server**: Handles auth, rate limits, project CRUD, enqueues execution requests
- **Worker Pool**: Independent processes that dequeue and run Docker containers
- **Scheduler** (future): Separate service for cron/webhook-triggered execution
- **WebSocket Server** (future): Standalone server for streaming, decoupled from API

## Request flow (high-level)

1. User visits the site → Next.js serves the SPA
2. User writes / uploads a Python script → clicks "Run"
3. Frontend sends `POST /api/run` with the script content
4. API server validates the request, enforces rate limits
5. Request is queued in Redis or executed immediately
6. Docker container is created and started by the API server (MVP) or a worker (post-MVP)
7. stdout/stderr is streamed to the frontend via WebSocket
8. On completion, output is saved to PostgreSQL and the container is destroyed
