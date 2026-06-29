# User Flow

## Guest user flow

```
Visit pylaunch.dev
        │
        ▼
  Landing page
  (hero, features, "Try now" CTA)
        │
        ▼
  Code editor page
  ┌─────────────────────────────────────┐
  │  • File upload (drag & drop)        │
  │  • Monaco editor (write code)       │
  │  • "Run" button                     │
  │  • Output panel (xterm.js)          │
  │  • Ad banner (non-intrusive)        │
  └─────────────────────────────────────┘
        │
        ▼
  Click "Run"
        │
        ├── Rate limited? ──▶ Show "Too many requests" with countdown
        │
        ├── Queue full? ──▶ Show "Queued — position #N" in footer
        │
        ▼
  Container starting (2s)
  (Footer: "Starting container...")
        │
        ▼
  See live output in terminal panel
  (Footer: "Running — 12.3s")
        │
        ├── WebSocket drops? ──▶ Auto-reconnect with "Reconnecting..." banner
        │
        ├── Timeout? ──▶ Show "Timed out — 60s limit" + partial output
        │
        ├── OOM? ──▶ Show "Script used too much memory"
        │
        ▼
  Execution complete
  (Footer: "Completed — 2.3s, exit code 0")
        │
        ▼
  Optional: "Sign up to save" prompt
```

## Registered user flow

```
Sign up / Log in
        │
        ▼
  Dashboard
  ┌─────────────────────────────────────┐
  │  • Project list (create, edit,      │
  │    delete, duplicate)               │
  │  • Execution history                │
  │  • Account settings (tier, email)   │
  └─────────────────────────────────────┘
        │
        ├── No projects? ──▶ Show welcome + "Create your first project"
        │
        ├── Search no results? ──▶ "No projects match your search"
        │
        ▼
  Open / create project
        │
        ▼
  Code editor (same as guest)
  • Project auto-saves
  • Version history (basic)
  • Share link (optional)
        │
        ▼
  Click "Run"
        │
        ▼
  Live output + saved to history
```

## Premium user flow

Same as registered, plus:

- No advertisements
- Priority queue (jump ahead of free users)
- 1 GB RAM / 1 CPU / 15 min timeout
- Longer project storage retention
- Export execution logs as text files
