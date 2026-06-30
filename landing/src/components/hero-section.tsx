"use client";

import { Button } from "@/components/ui/button";
import { SparklesCore } from "@/components/ui/sparkles"

export function HeroSection() {
  return (
    <section className="relative h-[40rem] w-full bg-black flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full absolute inset-0 h-full">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#00d992"
          speed={1}
        />
      </div>

      <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-primary to-transparent h-[2px] w-3/4 blur-sm" />
      <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-primary to-transparent h-px w-3/4" />
      <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-primary to-transparent h-[5px] w-1/4 blur-sm" />
      <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-primary to-transparent h-px w-1/4" />

      <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]" />

      <div className="relative z-20 mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <span className="mb-6 inline-block rounded-full border border-border px-4 py-1.5 text-xs font-semibold uppercase tracking-[2.52px] text-primary">
          Zero setup &bull; Free forever
        </span>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center text-white relative z-20 leading-tight">
          Run Python in your browser.
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            Free. No install.
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-300">
          Upload a script or write code, hit run, and watch it execute in an
          isolated cloud container. No Python, no pip, no setup.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Button size="lg">
            Start coding
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            See how it works
          </Button>
        </div>

        <p className="mt-6 text-xs text-neutral-500">
          No credit card required &bull; Works in any browser
        </p>
      </div>
    </section>
  );
}
