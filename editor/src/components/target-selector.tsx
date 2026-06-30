"use client";

import { useEffect, useState, useCallback } from "react";
import { Monitor, Server } from "lucide-react";

interface Agent {
  id: string;
  hostname: string;
  lastPing: number;
  version: string;
}

interface TargetSelectorProps {
  onTargetChange?: (target: string) => void;
}

export function TargetSelector({ onTargetChange }: TargetSelectorProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [target, setTarget] = useState("local");

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch("/api/agents");
        if (res.ok) {
          const data = await res.json();
          setAgents(data.agents ?? []);
        }
      } catch {
        /* server not ready */
      }
    };
    poll();
    const id = setInterval(poll, 5000);
    return () => clearInterval(id);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setTarget(e.target.value);
      onTargetChange?.(e.target.value);
    },
    [onTargetChange]
  );

  return (
    <div className="relative">
      <select
        value={target}
        onChange={handleChange}
        className="appearance-none bg-background border border-border rounded-sm px-2 py-1.5 pr-6 text-xs font-mono text-foreground focus:outline-none focus:border-ring cursor-pointer"
      >
        <option value="local">
          Local
        </option>
        {agents.map((a) => (
          <option key={a.id} value={`agent-${a.id}`}>
            {a.hostname}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-1.5 flex items-center">
        {target === "local" ? (
          <Monitor className="size-3 text-muted-foreground" />
        ) : (
          <Server className="size-3 text-primary" />
        )}
      </div>
    </div>
  );
}
