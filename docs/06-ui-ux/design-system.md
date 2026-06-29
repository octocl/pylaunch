# Design System

## Colors

| Token | Value | Usage |
|---|---|---|
| `--bg-primary` | `#0f0f13` | Page background |
| `--bg-secondary` | `#1a1a23` | Card / panel background |
| `--bg-tertiary` | `#24243a` | Input / editor background |
| `--text-primary` | `#e4e4ed` | Body text |
| `--text-secondary` | `#9a9ab0` | Muted text |
| `--accent` | `#6366f1` | Primary accent (buttons, links) |
| `--accent-hover` | `#818cf8` | Accent hover state |
| `--success` | `#22c55e` | Success indicators |
| `--error` | `#ef4444` | Error indicators |
| `--warning` | `#f59e0b` | Warning indicators |

## Typography

| Element | Font | Size | Weight |
|---|---|---|---|
| Headings | Inter | 2rem-3rem | 700 |
| Body | Inter | 0.875rem-1rem | 400 |
| Code / Terminal | JetBrains Mono | 0.875rem | 400 |
| Small / labels | Inter | 0.75rem | 500 |

## Spacing

Based on a 4px grid: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96.

## Components (shadcn/ui)

All UI components follow shadcn/ui conventions:

- Buttons (primary, secondary, ghost, danger)
- Inputs (text, file, search)
- Cards
- Modals / Dialogs
- Dropdown menus
- Tabs
- Badges
- Toasts

## Editor page

```
┌──────────────────────────────────────────────────────┐
│  Header (logo, project name, share, user menu)       │
├──────────────────────┬───────────────────────────────┤
│                      │                               │
│  Monaco Editor       │   xterm.js Terminal           │
│  (60% width)         │   (40% width)                 │
│                      │                               │
│  Syntax highlighting │   Live stdout/stderr          │
│  Dark theme          │   Auto-scroll                 │
│  Tab size: 4         │   Copy output button          │
│                      │                               │
│                      │   [Ad banner]                 │
│                      │                               │
├──────────────────────┴───────────────────────────────┤
│  Footer (run button, timeout indicator, status)      │
└──────────────────────────────────────────────────────┘
```

## Component states

Every interactive component has defined states:

### Button states

| State | Visual | Behavior |
|---|---|---|
| Default | Normal styling | Ready for interaction |
| Hover | Accent hover color | Cursor pointer |
| Active | Pressed state | Momentary on click |
| Loading | Pulsing/spinner + disabled | Prevents double-click |
| Disabled | Greyed out | Used during execution or when conditions unmet |
| Error | Shake animation (optional) | After failed action |

### Input states

| State | Visual |
|---|---|
| Default | Normal border |
| Focus | Accent border + glow |
| Error | Red border + error message below |
| Disabled | Greyed out |
| Loading | Debounced spinner (search inputs) |

### Execution states (editor footer)

| State | Footer indicator | Run button | Details |
|---|---|---|---|
| Idle | — | "Run" (enabled) | Waiting for user input |
| Queued | "Queued — position #3" | "Queued" (disabled) | Waiting in execution queue |
| Starting | "Starting container..." | "Starting" (disabled, spinner) | Docker container booting |
| Running | "Running (12.3s)" | "Running" (disabled) | Script executing; timer active |
| Stopping | "Stopping..." | "Stopping" (disabled) | Container being destroyed |
| Completed | "Completed — 2.3s" | "Run" (enabled) | Success with exit code shown |
| Failed | "Failed — exit code 1" | "Run" (enabled) | Non-zero exit code |
| Error | "Error — container failed" | "Run" (enabled, retry CTA shown) | Infrastructure error (502/503) |
| Timeout | "Timed out — 60s limit" | "Run" (enabled) | Execution exceeded time limit |
| Disconnected | "Reconnecting..." | "Run" (disabled) | WebSocket lost; auto-reconnect in progress |

### Empty states

| Screen | Empty state message | CTA |
|---|---|---|
| Dashboard (no projects) | "Welcome! Create your first project and start coding." | "Create project" |
| Execution history (no runs) | "Run a project to see your history here." | "Open a project" |
| Project search (no results) | "No projects match your search." | "Clear filter" |
| API keys (none created) | "No API keys yet. Generate one for programmatic access." | "Create API key" |

### Loading states

| Component | Loading treatment |
|---|---|
| Page (initial) | Full-page skeleton with pulsing rectangles matching layout |
| Project list | 4 skeleton cards with shimmer animation |
| Execution output | Terminal placeholder with pulsing cursor |
| Editor | Monaco loads instantly (lazy-loaded bundle), no skeleton needed |
| Dashboard stats | Stat cards show "—" while loading |

## Mobile editor strategy

The editor page presents unique challenges on mobile. The MVP explicitly targets desktop-first with limited mobile support.

### MVP: Desktop-first

- Minimum supported width: 768px (tablet landscape)
- Monaco editor and terminal are NOT usable for editing on sub-768px screens
- Mobile users see a **read-only view** of the editor + full output terminal
- Run button remains functional (tap to run)

### Responsive breakpoints

| Breakpoint | Layout | Editor | Terminal |
|---|---|---|---|
| ≥1024px (desktop) | Side-by-side (60/40) | Full editor | Full terminal |
| 768–1023px (tablet) | Side-by-side (50/50) | Full editor | Tab switch or smaller |
| <768px (mobile) | Stacked (full width) | Read-only code view | Full terminal (primary) |

### Mobile layout (<768px)

```
┌────────────────────┐
│ Header (condensed) │
├────────────────────┤
│                    │
│  Code View         │
│  (read-only)       │
│  Syntax highlighted│
│  Tap "Edit" to     │
│  open full Monaco  │
│  in a new tab      │
│                    │
├────────────────────┤
│ [▶ Run] [Edit]     │
├────────────────────┤
│                    │
│  Terminal Output   │
│  (full width)      │
│                    │
│  [Ad banner]       │
│                    │
└────────────────────┘
```

### Mobile-specific interactions

| Interaction | Design |
|---|---|
| **Run button** | Bottom-anchored, thumb-friendly (minimum 48px height) |
| **File upload** | Supports camera capture, file picker, and paste-from-clipboard |
| **Output scrolling** | Smooth touch scrolling; auto-scroll toggle |
| **Reconnection** | Persistent banner when connection drops; auto-reconnect with exponential backoff |
| **Dark/light mode** | Follows system preference by default; manual toggle in header |

### Post-MVP mobile improvements

- Responsive Monaco editor (tap-to-focus, floating keyboard toolbar)
- Native app wrappers (iOS/Android via PWA or Capacitor)
- Orientation-aware layout (landscape: side-by-side; portrait: stacked)
- Voice input for code (accessibility)
