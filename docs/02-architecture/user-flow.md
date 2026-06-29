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
        ▼
  See live output in terminal panel
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
