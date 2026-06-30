import { type ChildProcess } from "child_process";

const processes = new Map<string, ChildProcess>();

export function setProcess(id: string, proc: ChildProcess): void {
  processes.set(id, proc);
  proc.on("close", () => {
    processes.delete(id);
  });
}

export function getProcess(id: string): ChildProcess | undefined {
  return processes.get(id);
}
