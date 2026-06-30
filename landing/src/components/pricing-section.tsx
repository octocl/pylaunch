import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const freeFeatures = [
  "Ad-supported",
  "120s execution timeout",
  "256 MB memory",
  "0.5 CPU cores",
  "1 concurrent run",
  "50 max projects",
  "30-day history retention",
  "Internet access",
];

const premiumFeatures = [
  "No ads — ever",
  "300s execution timeout",
  "1 GB memory",
  "1 CPU core",
  "3 concurrent runs",
  "Unlimited projects",
  "1-year history retention",
  "Environment variables",
  "Priority queue",
];

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="border-t border-border py-24"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[2.52px] text-primary">
            Pricing
          </span>
          <h2 className="text-3xl font-normal tracking-tight text-foreground sm:text-4xl">
            Free to start. Premium when you need more.
          </h2>
          <p className="mt-4 text-muted-foreground">
            No hidden costs, no surprise billing, no credit card required to get
            started.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {/* Free */}
          <div className="rounded-md border border-border bg-background p-8">
            <h3 className="text-lg font-semibold text-foreground">Free</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              For quick scripts and learning
            </p>
            <div className="mt-6 mb-8">
              <span className="text-4xl font-normal text-foreground">$0</span>
              <span className="ml-1 text-sm text-muted-foreground">/month</span>
            </div>

            <Button
              variant="outline"
              className="mb-8 w-full"
            >
              Get started
            </Button>

            <ul className="space-y-3">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm">
                  <Check size={16} className="mt-0.5 shrink-0 text-primary" />
                  <span className="text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Premium */}
          <div className="relative rounded-md border border-primary bg-background p-8">
            <span className="absolute -top-3 left-6 rounded-full border border-primary bg-background px-3 py-0.5 text-xs font-semibold text-primary">
              Popular
            </span>
            <h3 className="text-lg font-semibold text-foreground">Premium</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              For power users and professionals
            </p>
            <div className="mt-6 mb-8">
              <span className="text-4xl font-normal text-foreground">$5</span>
              <span className="ml-1 text-sm text-muted-foreground">/month</span>
            </div>

            <Button className="mb-8 w-full">
              Subscribe now
            </Button>

            <ul className="space-y-3">
              {premiumFeatures.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm">
                  <Check size={16} className="mt-0.5 shrink-0 text-primary" />
                  <span className="text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
