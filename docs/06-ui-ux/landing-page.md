# Landing Page

The landing page (pylaunch.dev) is the primary marketing and conversion surface.

## Sections (top to bottom)

### Hero
- Headline: "Run Python in your browser. Free. No install."
- Subheadline: "Upload a script or write code, hit run, watch it execute in an isolated cloud container."
- Two CTAs: "Start coding" (primary, links to editor) and "See how it works" (secondary, scrolls to demo)

### How it works
Three-step visual explainer:

1. **Write** — Use the built-in editor or upload a `.py` file
2. **Run** — Click run. We spin up a secure Docker container.
3. **See** — Watch output stream live to your browser.

### Features grid
4-column grid highlighting:

- Zero setup
- Docker isolation
- Live terminal output
- Free forever

### Use cases
Row of cards showing real applications:

- Discord bots
- Telegram bots
- Web scraping
- API testing
- Learning Python

### Pricing
Two-column comparison (Free vs Premium) with key differences highlighted.

### Footer
Logo, links (About, Privacy, Terms, Contact), social icons.

## Design notes

- Dark theme by default (with light mode toggle)
- Animated transitions on scroll (Framer Motion)
- Mobile-responsive layout (stack columns on small screens)
- Loads fast: static-generated, minimal JS
