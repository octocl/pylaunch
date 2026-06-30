import {
  Bot,
  MessageSquare,
  Globe,
  Beaker,
  BookOpen,
  Cog,
} from "lucide-react";

const useCases = [
  {
    icon: Bot,
    title: "Discord bots",
    description:
      "Write and test Discord bot scripts using discord.py without hosting them on a VPS.",
  },
  {
    icon: MessageSquare,
    title: "Telegram bots",
    description:
      "Prototype Telegram bot handlers and test polling-based scripts with python-telegram-bot.",
  },
  {
    icon: Globe,
    title: "Web scraping",
    description:
      "Run scrapers with requests, BeautifulSoup, or Playwright. Full internet access included.",
  },
  {
    icon: Beaker,
    title: "API testing",
    description:
      "Quickly test REST endpoints, verify API keys, and prototype integrations without Postman.",
  },
  {
    icon: BookOpen,
    title: "Learning Python",
    description:
      "Perfect for beginners. No local setup — write code, run it, see results immediately.",
  },
  {
    icon: Cog,
    title: "Automation",
    description:
      "Run scheduled automation scripts via GitHub Actions or webhooks using the PyLaunch API.",
  },
];

export function UseCases() {
  return (
    <section
      id="use-cases"
      className="border-t border-border py-24"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[2.52px] text-primary">
            Use cases
          </span>
          <h2 className="text-3xl font-normal tracking-tight text-foreground sm:text-4xl">
            From bots to scrapers and everything in between
          </h2>
          <p className="mt-4 text-muted-foreground">
            PyLaunch handles a wide range of Python workloads out of the box.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((uc) => (
            <div
              key={uc.title}
              className="group rounded-md border border-border bg-background p-6 transition-colors hover:border-primary/50"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-sm border border-border bg-card text-primary">
                <uc.icon size={18} />
              </div>
              <h3 className="mb-2 text-base font-semibold text-foreground">
                {uc.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {uc.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
