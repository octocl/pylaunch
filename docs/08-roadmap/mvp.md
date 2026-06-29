# MVP

The MVP goal is a working platform that guests and registered users can use to run Python scripts.

## Phase 1 — Core execution

- [x] Rust API server with Axum
- [x] Docker integration (create, run, stream, destroy)
- [x] WebSocket log streaming
- [x] Guest execution (no auth required)
- [x] Rate limiting (IP-based, sliding window)
- [x] Execution timeout enforcement

## Phase 2 — User system

- [x] User registration and login (email + password)
- [x] JWT session management
- [x] PostgreSQL schema for users, projects, executions
- [x] Guest → registered conversion prompt

## Phase 3 — Project management

- [x] Project CRUD (create, read, update, delete)
- [x] Auto-save on run
- [x] Execution history per project
- [x] Re-run from history

## Phase 4 — Frontend

- [x] Next.js app with Tailwind + shadcn/ui
- [x] Monaco code editor
- [x] xterm.js terminal output
- [x] Landing page
- [x] Dashboard (project list + history)
- [x] Editor page (code + output + run button)

## Phase 5 — Polish

- [x] Responsive design (mobile support)
- [x] Dark/light mode toggle
- [x] Loading states and error handling
- [x] Ad banner placement
- [x] Basic analytics (execution count, unique users)
