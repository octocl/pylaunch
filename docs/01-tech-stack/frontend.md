# Frontend

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Components | shadcn/ui |
| Animation | Framer Motion |
| Code Editor | Monaco Editor |
| Terminal | xterm.js |

## Architecture

The frontend is a **single-page application** served by Next.js. Most pages are client-rendered for interactivity; landing and marketing pages use static generation for performance.

### Key pages

- **Landing page** — static marketing content, hero section, feature highlights
- **Editor page** — Monaco editor + file upload + output panel with xterm.js
- **Dashboard** — project list, execution history, account settings (registered users)
- **Pricing** — free vs premium comparison

### Editor integration

The editor page connects to the backend via:

- **REST** — to submit execution requests and fetch project data
- **WebSocket** — to stream stdout/stderr from the running container to xterm.js

## Design decisions

**Why Next.js?** Server-side rendering for landing/marketing pages (SEO), App Router for clean routing, and a mature ecosystem.

**Why Monaco?** It's the editor that powers VS Code — familiar, feature-rich, and well-maintained.

**Why xterm.js?** The de facto standard for in-browser terminals. Lightweight and well-tested for streaming output.

**Why shadcn/ui?** Copy-paste components that are fully customizable with Tailwind. No heavy component library dependency.
