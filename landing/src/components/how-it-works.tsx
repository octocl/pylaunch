import { Code2, Play, Eye } from "lucide-react";

const steps = [
  {
    icon: Code2,
    title: "Write",
    description:
      "Use the built-in Monaco editor or upload a .py file. Syntax highlighting, dark theme, tab support.",
  },
  {
    icon: Play,
    title: "Run",
    description:
      "Click run. We spin up a secure Docker container and execute your code in under 2 seconds.",
  },
  {
    icon: Eye,
    title: "See",
    description:
      "Watch stdout/stderr stream live to your browser via WebSocket. Real-time output, auto-scroll.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-t border-border py-24"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[2.52px] text-primary">
            How it works
          </span>
          <h2 className="text-3xl font-normal tracking-tight text-foreground sm:text-4xl">
            From code to execution in seconds
          </h2>
          <p className="mt-4 text-muted-foreground">
            Three simple steps. No terminal. No config files. No virtualenv.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="group rounded-md border border-border bg-background p-6 transition-colors hover:border-primary/50"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-sm border border-border bg-card text-primary">
                <step.icon size={20} />
              </div>
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground">
                  0{i + 1}
                </span>
                <h3 className="text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
