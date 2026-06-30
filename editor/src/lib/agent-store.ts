export interface AgentInfo {
  id: string;
  hostname: string;
  lastPing: number;
  version: string;
}

export interface AgentTask {
  taskId: string;
  code: string;
  env: Record<string, string>;
}

const agents = new Map<string, AgentInfo>();
const agentQueues = new Map<string, AgentTask[]>();
const outputStreams = new Map<string, ReadableStreamDefaultController[]>();
const taskResolvers = new Map<string, (result: { exitCode: number }) => void>();

export function getAgents(): AgentInfo[] {
  const now = Date.now();
  return Array.from(agents.values()).filter((a) => now - a.lastPing < 30000);
}

export function getAgent(id: string): AgentInfo | undefined {
  const a = agents.get(id);
  if (!a) return undefined;
  if (Date.now() - a.lastPing >= 30000) return undefined;
  return a;
}

export function updateAgent(id: string, info: Partial<AgentInfo>): void {
  const existing = agents.get(id) || {
    id,
    hostname: "",
    lastPing: 0,
    version: "",
  };
  agents.set(id, { ...existing, ...info, lastPing: Date.now() });
}

export function queueTask(agentId: string, task: AgentTask): void {
  const queue = agentQueues.get(agentId) ?? [];
  queue.push(task);
  agentQueues.set(agentId, queue);
}

export function dequeueTask(agentId: string): AgentTask | null {
  const queue = agentQueues.get(agentId) ?? [];
  const task = queue.shift() ?? null;
  if (queue.length === 0) agentQueues.delete(agentId);
  return task;
}

export function registerOutputStream(
  taskId: string,
  controller: ReadableStreamDefaultController
): void {
  const streams = outputStreams.get(taskId) ?? [];
  streams.push(controller);
  outputStreams.set(taskId, streams);
}

export function pushOutput(
  taskId: string,
  event: string,
  data: string
): void {
  const streams = outputStreams.get(taskId) ?? [];
  const encoder = new TextEncoder();
  for (const ctrl of streams) {
    try {
      ctrl.enqueue(
        encoder.encode(JSON.stringify({ event, data }) + "\n")
      );
    } catch {
      /* stream closed */
    }
  }
}

export function waitForTask(
  taskId: string
): Promise<{ exitCode: number }> {
  return new Promise((resolve) => {
    taskResolvers.set(taskId, resolve);
  });
}

export function resolveTask(
  taskId: string,
  result: { exitCode: number }
): void {
  const resolver = taskResolvers.get(taskId);
  if (resolver) {
    resolver(result);
    taskResolvers.delete(taskId);
  }
  const streams = outputStreams.get(taskId) ?? [];
  for (const ctrl of streams) {
    try {
      ctrl.close();
    } catch {
      /* already closed */
    }
  }
  outputStreams.delete(taskId);
}
