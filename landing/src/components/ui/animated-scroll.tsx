"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) | 0;
    return (s >>> 0) / 4294967296;
  };
}

const rng = seededRandom(42);

const sections = [
  {
    label: "01",
    title: "Write Python",
    description:
      "Open the Monaco editor and start typing. Syntax highlighting, dark theme, tab support — everything you expect from a modern editor.",
    accent: "#00d992",
  },
  {
    label: "02",
    title: "Hit Run",
    description:
      "Click run. We spin up a secure Docker container in under 2 seconds. Every execution is fresh, isolated, and disposable.",
    accent: "#2fd6a1",
  },
  {
    label: "03",
    title: "See Output Live",
    description:
      "stdout and stderr stream to your browser in real time. Auto-scroll, copy support, and full execution history for registered users.",
    accent: "#10b981",
  },
  {
    label: "04",
    title: "No Setup Required",
    description:
      "No Python, no pip, no virtualenv. Works on any device with a browser — phone, tablet, or Chromebook.",
    accent: "#00d992",
  },
];

const particleCount = 40;
const particles = Array.from({ length: particleCount }).map(() => ({
  left: rng() * 100,
  top: -10 + rng() * 120,
  delay: rng() * 5,
  duration: 3 + rng() * 4,
  size: 1.5 + rng() * 3,
}));

function SectionCard({
  section,
  index,
}: {
  section: (typeof sections)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.visible = "true";
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-visible="false"
      className="flex flex-col items-center justify-center px-6 py-32 opacity-0 transition-all duration-1000 data-[visible=true]:opacity-100 data-[visible=true]:translate-y-0 translate-y-16"
    >
      <span
        className="mb-3 font-mono text-sm font-bold tracking-[0.2em]"
        style={{ color: section.accent }}
      >
        {section.label}
      </span>
      <h2 className="mb-4 text-center text-4xl font-bold text-white sm:text-5xl">
        {section.title}
      </h2>
      <p className="max-w-xl text-center text-lg leading-relaxed text-neutral-400">
        {section.description}
      </p>
    </div>
  );
}

export default function ScrollAdventure() {
  return (
    <div className="relative min-h-screen w-full bg-black">
      {/* Ambient particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {particles.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary/20 animate-pulse"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
        {/* Gradient orbs */}
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* Progress bar */}
      <ScrollProgress />

      {/* Sticky header */}
      <div className="fixed top-0 left-0 right-0 z-10 flex items-center justify-center border-b border-white/5 bg-black/60 py-4 backdrop-blur-sm">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
          Scroll to explore
        </span>
      </div>

      {/* Sections */}
      {sections.map((section, i) => (
        <SectionCard key={i} section={section} index={i} />
      ))}

      {/* Footer CTA */}
      <div className="flex flex-col items-center justify-center px-6 py-32">
        <span className="mb-2 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
          Ready?
        </span>
        <h2 className="mb-6 text-center text-4xl font-bold text-white sm:text-5xl">
          Start Coding Now
        </h2>
        <Button size="lg">
          Launch Editor
        </Button>
      </div>
    </div>
  );
}

function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      if (ref.current) {
        ref.current.style.width = `${progress}%`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-20 h-0.5 bg-white/10">
      <div
        ref={ref}
        className="h-full bg-primary transition-all duration-150"
        style={{ width: "0%" }}
      />
    </div>
  );
}
