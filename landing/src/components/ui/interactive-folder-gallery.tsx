"use client";

import { motion } from "framer-motion";
import {
  FileCode,
  Play,
  Radio,
  Zap,
  ArrowRight,
  Terminal,
} from "lucide-react";
import { useState } from "react";

const steps = [
  {
    number: "01",
    icon: FileCode,
    title: "Write Python",
    description:
      "Open the Monaco editor and start typing. Syntax highlighting, dark theme, tab support \u2014 everything you expect from a modern editor.",
    gradient: "from-blue-500/20 to-cyan-500/5",
    borderGlow: "group-hover:border-blue-500/30",
    accent: "text-blue-400",
  },
  {
    number: "02",
    icon: Play,
    title: "Hit Run",
    description:
      "Click run. We spin up a secure Docker container in under 2 seconds. Every execution is fresh, isolated, and disposable.",
    gradient: "from-green-500/20 to-emerald-500/5",
    borderGlow: "group-hover:border-green-500/30",
    accent: "text-green-400",
  },
  {
    number: "03",
    icon: Radio,
    title: "See Output Live",
    description:
      "stdout and stderr stream to your browser in real time. Auto-scroll, copy support, and full execution history for registered users.",
    gradient: "from-purple-500/20 to-pink-500/5",
    borderGlow: "group-hover:border-purple-500/30",
    accent: "text-purple-400",
  },
  {
    number: "04",
    icon: Zap,
    title: "No Setup Required",
    description:
      "No Python, no pip, no virtualenv. Works on any device with a browser \u2014 phone, tablet, or Chromebook.",
    gradient: "from-amber-500/20 to-orange-500/5",
    borderGlow: "group-hover:border-amber-500/30",
    accent: "text-amber-400",
  },
];

function InteractiveFolderGallery() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isHovered = hoveredIndex === index;
          const isExpanded = expandedIndex === index;
          const delay = index * 0.1;

          return (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay,
                type: "spring",
                stiffness: 100,
                damping: 20,
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setExpandedIndex(isExpanded ? null : index)}
              className="group relative cursor-pointer"
              style={{ perspective: "800px" }}
            >
              {/* Folder body */}
              <motion.div
                animate={{
                  rotateX: isHovered ? -4 : 0,
                  y: isHovered ? -4 : 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                }}
                className={`
                  relative rounded-xl border border-white/[0.06] overflow-hidden
                  transition-colors duration-300
                  ${step.borderGlow}
                `}
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
                  boxShadow: isHovered
                    ? "0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(255,255,255,0.03)"
                    : "0 4px 20px rgba(0,0,0,0.3)",
                }}
              >
                {/* Folder tab shape */}
                <div className="relative">
                  <div
                    className={`
                      absolute top-0 left-6 w-16 h-4 rounded-t-md
                      transition-all duration-300
                      ${isHovered ? "opacity-100" : "opacity-60"}
                    `}
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)",
                    }}
                  />

                  {/* Header */}
                  <div className="relative px-5 pt-5 pb-3 flex items-center gap-3">
                    <div
                      className={`
                        flex items-center justify-center w-9 h-9 rounded-lg
                        transition-all duration-300
                        ${isHovered ? "bg-white/[0.12] scale-110" : "bg-white/[0.06]"}
                      `}
                    >
                      <Icon className={`w-4 h-4 ${step.accent} transition-colors duration-300`} />
                    </div>
                    <div className="flex items-baseline gap-2 min-w-0">
                      <span className="text-[11px] font-mono text-white/30 font-medium tabular-nums">
                        {step.number}
                      </span>
                      <span className="text-sm font-semibold text-white/90 truncate tracking-tight">
                        {step.title}
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className="ml-auto text-white/20"
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path
                          d="M2 3.5L5 6.5L8 3.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </motion.div>
                  </div>

                  {/* Expandable content */}
                  <motion.div
                    initial={false}
                    animate={{
                      height: isExpanded ? "auto" : 0,
                      opacity: isExpanded ? 1 : 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 24,
                    }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-1">
                      <div className="h-px bg-white/[0.06] mb-3" />
                      <p className="text-sm text-white/50 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Hover glow ring */}
              <motion.div
                initial={false}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute -inset-[2px] rounded-xl -z-10"
                style={{
                  background:
                    index === 0
                      ? "linear-gradient(135deg, rgba(59,130,246,0.15), transparent 60%)"
                      : index === 1
                        ? "linear-gradient(135deg, rgba(34,197,94,0.15), transparent 60%)"
                        : index === 2
                          ? "linear-gradient(135deg, rgba(168,85,247,0.15), transparent 60%)"
                          : "linear-gradient(135deg, rgba(245,158,11,0.15), transparent 60%)",
                  filter: "blur(12px)",
                }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 100, damping: 20 }}
        className="mt-12 flex justify-center"
      >
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="
            group relative inline-flex items-center gap-2.5
            px-8 py-3.5 rounded-xl
            bg-white text-black font-medium text-sm
            shadow-lg shadow-white/20
            transition-shadow duration-300
            hover:shadow-xl hover:shadow-white/30
          "
        >
          <Terminal className="w-4 h-4" />
          <span className="text-black/60">Ready?</span>
          <span className="font-semibold text-black">Start Coding Now</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          <div className="absolute inset-0 rounded-xl bg-white/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.button>
      </motion.div>
    </div>
  );
}

export { InteractiveFolderGallery };
