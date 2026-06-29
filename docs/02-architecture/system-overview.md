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

## Request flow (high-level)

1. User visits the site → Next.js serves the SPA
2. User writes/ uploads a Python script → clicks "Run"
3. Frontend sends `POST /api/run` with the script content
4. API server validates the request, enforces rate limits
5. Request is queued or executed immediately
6. Docker container is created and started
7. stdout/stderr is streamed to the frontend via WebSocket
8. On completion, output is saved to PostgreSQL and the container is destroyed
