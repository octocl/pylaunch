export type ExecutionState =
  | "idle"
  | "queued"
  | "starting"
  | "running"
  | "stopping"
  | "completed"
  | "failed"
  | "timed_out"
  | "oom_killed"
  | "error"
  | "disconnected";

export interface ExecutionStatus {
  state: ExecutionState;
  message: string;
  duration?: number;
  exitCode?: number;
  queuePosition?: number;
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const seconds = (ms / 1000).toFixed(1);
  return `${seconds}s`;
}

export function getStatusMessage(status: ExecutionStatus): string {
  switch (status.state) {
    case "idle":
      return "";
    case "queued":
      return `Queued — position #${status.queuePosition ?? "?"}`;
    case "starting":
      return "Starting container...";
    case "running":
      return `Running — ${formatDuration(status.duration ?? 0)}`;
    case "stopping":
      return "Stopping...";
    case "completed":
      return `Completed — ${formatDuration(status.duration ?? 0)}`;
    case "failed":
      return `Failed — exit code ${status.exitCode ?? "?"}`;
    case "timed_out":
      return "Timed out — 60s limit";
    case "oom_killed":
      return "Out of memory — 256 MB limit";
    case "error":
      return "Error — container failed to start";
    case "disconnected":
      return "Reconnecting...";
  }
}
