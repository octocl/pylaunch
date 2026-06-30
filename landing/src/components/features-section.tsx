import {
  Terminal,
  Shield,
  Zap,
  Infinity,
  Globe,
  User,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Zero setup",
    description:
      "Open a browser and start coding. No Python, no pip, no virtualenv. Works on any device.",
  },
  {
    icon: Shield,
    title: "Docker isolation",
    description:
      "Every execution runs in a fresh Docker container. No state leakage between runs. Secure by default.",
  },
  {
    icon: Terminal,
    title: "Live terminal output",
    description:
      "stdout and stderr stream to your browser in real time via WebSocket. Auto-scroll with copy support.",
  },
  {
    icon: Infinity,
    title: "Free forever",
    description:
      "No credit card required. No trial period. The free tier is sustainable via non-intrusive ads.",
  },
  {
    icon: Globe,
    title: "Internet access",
    description:
      "Scripts can pip install packages, call REST APIs, connect to databases, and reach any public service.",
  },
  {
    icon: User,
    title: "No account required",
    description:
      "Guests can upload and run immediately. Create an account to save projects and access history.",
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="border-t border-border py-24"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[2.52px] text-primary">
            Everything you need
          </span>
          <h2 className="text-3xl font-normal tracking-tight text-foreground sm:text-4xl">
            Built for speed and simplicity
          </h2>
          <p className="mt-4 text-muted-foreground">
            PyLaunch removes every barrier between &ldquo;I have a Python
            script&rdquo; and &ldquo;it&rsquo;s running.&rdquo;
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-md border border-border bg-background p-6 transition-colors hover:border-primary/50"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-sm border border-border bg-card text-primary">
                <feature.icon size={18} />
              </div>
              <h3 className="mb-2 text-base font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
