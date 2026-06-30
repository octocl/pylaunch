"use client";

import { cn } from "@/lib/utils";
import type { ExecutionStatus } from "@/lib/execution";
import { getStatusMessage } from "@/lib/execution";

interface StatusFooterProps {
  status: ExecutionStatus;
}

const stateColor: Record<string, string> = {
  idle: "text-muted-foreground",
  queued: "text-yellow-400",
  starting: "text-muted-foreground",
  running: "text-primary",
  stopping: "text-muted-foreground",
  completed: "text-green-400",
  failed: "text-red-400",
  timed_out: "text-yellow-400",
  oom_killed: "text-red-400",
  error: "text-red-400",
  disconnected: "text-yellow-400",
};

export function StatusFooter({ status }: StatusFooterProps) {
  const message = getStatusMessage(status);

  if (!message) {
    return (
      <footer className="flex items-center justify-between px-4 py-2 border-t border-border bg-background shrink-0">
        <span className="text-xs text-muted-foreground">
          Ready
        </span>
        <span className="text-xs text-muted-foreground">
          Ctrl+Enter to run
        </span>
      </footer>
    );
  }

  return (
    <footer className="flex items-center justify-between px-4 py-2 border-t border-border bg-background shrink-0">
      <span className={cn("text-xs font-mono", stateColor[status.state])}>
        {message}
      </span>
      <span className="text-xs text-muted-foreground">
        {status.state === "running"
          ? "Click to stop execution"
          : "Ctrl+Enter to run"}
      </span>
    </footer>
  );
}
