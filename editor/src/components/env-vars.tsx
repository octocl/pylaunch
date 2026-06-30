"use client";

import { useState, useCallback, useEffect, useId } from "react";
import { Variable, X } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "pylaunch_env_vars";

function loadEnvVars(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveEnvVars(vars: Record<string, string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vars));
}

interface EnvVarsProps {
  onEnvChange?: (vars: Record<string, string>) => void;
}

export function EnvVars({ onEnvChange }: EnvVarsProps) {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<[string, string][]>(
    () => Object.entries(loadEnvVars())
  );
  const id = useId();

  useEffect(() => {
    const obj = Object.fromEntries(entries.filter(([k]) => k.trim()));
    saveEnvVars(obj);
    onEnvChange?.(obj);
  }, [entries, onEnvChange]);

  const addEntry = useCallback(() => {
    setEntries((prev) => [...prev, ["", ""]]);
  }, []);

  const removeEntry = useCallback((i: number) => {
    setEntries((prev) => prev.filter((_, idx) => idx !== i));
  }, []);

  const updateEntry = useCallback(
    (i: number, key: string, value: string) => {
      setEntries((prev) => {
        const next = [...prev];
        next[i] = [key, value];
        return next;
      });
    },
    []
  );

  const count = entries.filter(([k]) => k.trim()).length;
  const activeColor = count > 0 ? "text-primary" : "text-muted-foreground";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "inline-flex items-center gap-1.5 px-2 py-1.5 rounded-sm text-xs font-medium transition-all",
          "border border-border hover:border-ring",
          open ? "border-ring" : activeColor
        )}
        title="Environment variables"
      >
        <Variable className="size-3.5" />
        {count > 0 && <span className="font-mono text-xs">{count}</span>}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 z-50 w-80 bg-card border border-border rounded-md shadow-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-foreground">
                Environment Variables
              </span>
              <button
                onClick={addEntry}
                className="text-xs text-primary hover:underline"
              >
                + Add
              </button>
            </div>

            {entries.length === 0 && (
              <p className="text-xs text-muted-foreground mb-2">
                No variables set. Add KEY=VALUE pairs.
              </p>
            )}

            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {entries.map(([k, v], i) => (
                <div key={i} className="flex items-center gap-1">
                  <input
                    value={k}
                    onChange={(e) => updateEntry(i, e.target.value, v)}
                    placeholder="KEY"
                    className="flex-1 min-w-0 bg-background border border-border rounded-sm px-2 py-1 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring"
                  />
                  <span className="text-muted-foreground text-xs">=</span>
                  <input
                    value={v}
                    onChange={(e) => updateEntry(i, k, e.target.value)}
                    placeholder="VALUE"
                    className="flex-[2] min-w-0 bg-background border border-border rounded-sm px-2 py-1 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring"
                  />
                  <button
                    onClick={() => removeEntry(i)}
                    className="text-muted-foreground hover:text-destructive shrink-0"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
