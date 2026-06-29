# Dashboard

The dashboard is the home for registered users.

## Layout

```
┌──────────────────────────────────────────────────┐
│  Logo          Dashboard   [Profile] [Sign Out]  │
├──────────────────────────────────────────────────┤
│                                                    │
│  ┌──────────────┐  ┌───────────────────────────┐  │
│  │ Create New   │  │ Search projects...        │  │
│  │ Project [+]  │  └───────────────────────────┘  │
│  └──────────────┘                                  │
│                                                    │
│  ┌──────────────────────────────────────────────┐ │
│  │ Recent Projects                               │ │
│  │ ┌──────────┐ ┌──────────┐ ┌──────────┐      │ │
│  │ │ web-scra │ │ discord- │ │ test-api │      │ │
│  │ │ per      │ │ bot      │ │          │      │ │
│  │ │ 2h ago   │ │ 1d ago   │ │ 3d ago   │      │ │
│  │ └──────────┘ └──────────┘ └──────────┘      │ │
│  └──────────────────────────────────────────────┘ │
│                                                    │
│  ┌──────────────────────────────────────────────┐ │
│  │ Execution History                              │ │
│  │ [Today]                                        │ │
│  │  web-scraper  ✓ completed  2.3s  12:30       │ │
│  │  test-api     ✗ failed      0.8s  11:15       │ │
│  │ [Yesterday]                                    │ │
│  │  discord-bot  ✓ completed  45.2s 09:00       │ │
│  └──────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

## Sections

| Section | Content |
|---|---|
| **Sidebar / top bar** | Navigation: Dashboard, New Project, Settings |
| **Create New** | Button to create a blank project or upload a file |
| **Project grid** | Card layout showing recent projects with name, last-run time |
| **Search** | Quick filter across all projects |
| **History** | Chronological list of executions with status, duration, timestamp |

## Empty state

When a new user has no projects, the dashboard shows:

- Welcome message
- "Create your first project" CTA
- Link to example projects gallery (future)
