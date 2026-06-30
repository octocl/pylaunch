"use client";

import { Play, Loader2, Square } from "lucide-react";
import type { ExecutionState } from "@/lib/execution";
import { cn } from "@/lib/utils";

interface RunButtonProps {
  state: ExecutionState;
  onRun: () => void;
  onStop: () => void;
}

const isRunningState = (state: ExecutionState) =>
  ["queued", "starting", "running", "stopping", "disconnected"].includes(state);

const isRunEnabled = (state: ExecutionState) =>
  ["idle", "completed", "failed", "timed_out", "oom_killed", "error"].includes(state);

export function RunButton({ state, onRun, onStop }: RunButtonProps) {
  const running = isRunningState(state);
  const enabled = isRunEnabled(state);

  if (running) {
    return (
      <button
        onClick={onStop}
        disabled={state === "stopping"}
        className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-semibold transition-all",
          "bg-muted text-muted-foreground border border-border cursor-not-allowed"
        )}
      >
        <Loader2 className="size-4 animate-spin" />
        <span>
          {state === "queued"
            ? "Queued"
            : state === "starting"
              ? "Starting"
              : state === "stopping"
                ? "Stopping"
                : state === "disconnected"
                  ? "Reconnecting"
                  : "Running"}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={onRun}
      disabled={!enabled}
      className={cn(
        "inline-flex items-center gap-2 px-5 py-2 rounded-sm text-sm font-semibold transition-all",
        "bg-primary text-primary-foreground hover:brightness-110 active:brightness-90",
        "disabled:opacity-50 disabled:cursor-not-allowed"
      )}
    >
      <Play className="size-4 fill-current" />
      <span>Run</span>
    </button>
  );
}
