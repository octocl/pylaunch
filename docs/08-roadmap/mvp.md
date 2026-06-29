# MVP

The MVP goal is a working platform that guests and registered users can use to run Python scripts.

**Status: Design / Specified only. No implementation code exists yet.**

## Phase 1 — Core execution

- [ ] Rust API server with Axum
- [ ] Docker integration (create, run, stream, destroy)
- [ ] WebSocket log streaming
- [ ] Guest execution (no auth required)
- [ ] Rate limiting (IP-based, sliding window)
- [ ] Execution timeout enforcement

## Phase 2 — User system

- [ ] User registration and login (email + password)
- [ ] JWT session management
- [ ] PostgreSQL schema for users, projects, executions
- [ ] Guest → registered conversion prompt

## Phase 3 — Project management

- [ ] Project CRUD (create, read, update, delete)
- [ ] Auto-save on run
- [ ] Execution history per project
- [ ] Re-run from history

## Phase 4 — Frontend

- [ ] Next.js app with Tailwind + shadcn/ui
- [ ] Monaco code editor
- [ ] xterm.js terminal output
- [ ] Landing page
- [ ] Dashboard (project list + history)
- [ ] Editor page (code + output + run button)

## Phase 5 — Polish

- [ ] Responsive design (desktop-first; mobile strategy defined in design-system.md)
- [ ] Dark/light mode toggle
- [ ] Loading states and error handling (partially specified in design docs; needs frontend implementation)
- [ ] Ad banner placement
- [ ] Basic analytics (execution count, unique users)
