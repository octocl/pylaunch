# Competitive Analysis

## Overview

PyLaunch competes in the in-browser code execution space. Below is an analysis of key competitors, their strengths and weaknesses, and PyLaunch's positioning.

## Competitor comparison

| Feature | PyLaunch (planned) | Replit | Google Colab | PythonAnywhere | Glitch |
|---|---|---|---|---|---|
| **Python execution** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ❌ Node.js focused |
| **Free tier** | ✅ Yes (ad-supported) | ✅ Yes (limited) | ✅ Yes (limited GPU) | ✅ Yes (limited) | ✅ Yes |
| **No account required** | ✅ Yes (guest mode) | ❌ Sign-up required | ❌ Google account | ❌ Sign-up required | ❌ Sign-up required |
| **Docker isolation** | ✅ Yes (per-run) | ⚠️ Partial (container per repl) | ✅ Yes (VM per session) | ✅ Yes (per-user) | ✅ Yes (container per project) |
| **Live WebSocket output** | ✅ Yes | ✅ Yes | ✅ Yes | ❌ Polling-based | ✅ Yes |
| **Monaco editor** | ✅ Yes | ✅ Yes (forked) | ❌ Custom editor | ❌ Basic editor | ❌ Custom editor |
| **Mobile editing** | ❌ Not yet designed | ✅ Yes (responsive) | ⚠️ Read-only mobile | ❌ Desktop-only | ✅ Yes (responsive) |
| **API / programmatic** | ⚠️ Planned (medium-term) | ✅ Yes (Replit API) | ✅ Yes (REST API) | ✅ Yes (SCP, API) | ✅ Yes (API) |
| **Self-hostable** | ❌ No | ❌ No | ❌ No | ❌ No | ✅ Yes (open source) |
| **Pricing (paid)** | $5/mo (planned) | $7–$25/mo | $9.99/mo (Colab Pro) | $5–$12/mo | $8–$16/mo |

## Competitor deep-dive

### Replit
- **Strengths:** Largest user base, multi-language support, community features (forks, comments), mobile app, AI assistant (Ghostwriter), deployments.
- **Weaknesses:** Free tier is restrictive (limited CPU/RAM, slow startup), requires account, mobile editing is functional but not great for code-heavy work. Recent pricing changes have alienated some users.
- **PyLaunch advantage:** Guest mode (no account), faster startup (simple Python only), simpler UX focused on a single language.

### Google Colab
- **Strengths:** Free GPU access, tight Google Drive integration, good for ML/data science, well-known brand.
- **Weaknesses:** Notebook format (not ideal for scripts), requires Google account, 12-hour session limit, no persistent projects in free tier, no real-time terminal UX.
- **PyLaunch advantage:** Traditional script-based workflow (notebooks), terminal-style output, project persistence for registered users, lower barrier to entry.

### PythonAnywhere
- **Strengths:** Mature platform, full Python environment, scheduled tasks, MySQL support, web app hosting.
- **Weaknesses:** No container isolation (shared filesystem), limited packages, outdated UI, no WebSocket streaming, desktop-only.
- **PyLaunch advantage:** Docker isolation, modern UI, WebSocket streaming, guest mode.

### Glitch
- **Strengths:** Great for full-stack web apps, community remixing, always-on projects, open source editor.
- **Weaknesses:** Node.js focused, limited Python support, no script-execution workflow.
- **PyLaunch advantage:** Python-first, script execution focus (not web app hosting).

## PyLaunch's unique positioning

1. **Zero-friction Python execution** — Guest mode means a user goes from "I have a Python script" to "it's running" in under 10 seconds with no account creation.
2. **Free tier that's genuinely useful** — Ad-supported model keeps the free tier unrestricted enough for real use, unlike competitors where free tiers are heavily throttled.
3. **Docker-per-run isolation** — Every execution is a fresh container. No competitors do this at the individual run level (most do per-project or per-session).
4. **Single-language focus** — By focusing on Python only, the UX is simpler and more polished than multi-language platforms.

## Threats

- Replit's AI features (Ghostwriter) create lock-in
- Google Colab's GPU access is hard to compete with for ML workloads
- Competitors lowering prices or improving free tiers
- Cloud provider entry into the space (AWS Cloud9, GitHub Codespaces)

## Strategic recommendations

1. Lean into the **guest mode** differentiator — it's the strongest moat against Replit and Colab
2. Build the **API** early to attract developers who want script execution in CI/CD pipelines
3. Add **shareable gist-style links** to enable viral growth
4. Target the **mobile + Chromebook audience** that competitors underserve
