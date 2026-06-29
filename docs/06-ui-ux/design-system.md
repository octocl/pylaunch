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
