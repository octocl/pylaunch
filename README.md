# PyLaunch

Run Python in your browser. Free. No install.

PyLaunch is a cloud platform that runs Python scripts inside isolated Docker containers — no local Python installation required. Write code in a Monaco editor, hit run, and watch output stream live to your browser via WebSocket.

## Status

**Design / planning phase.** See [docs/](./docs/) for the full architecture, feature specs, and roadmap.

## Planned stack

- **Backend:** Rust (Axum, Tokio, SQLx, bollard)
- **Frontend:** TypeScript (Next.js, Tailwind, shadcn/ui, Monaco, xterm.js)
- **Infrastructure:** Docker, PostgreSQL, Redis, Nginx

## License

Not yet licensed.
