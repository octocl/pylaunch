export interface MemoryInfo {
  total: number;
  used: number;
  available: number;
  percent: number;
}

export interface SystemInfo {
  os: string;
  cpu: number;
  disk_total: number;
  disk_used: number;
}

export interface AgentInfo {
  id: string;
  hostname: string;
  lastPing: number;
  version: string;
  memory?: MemoryInfo;
  system?: SystemInfo;
}

const agents = new Map<string, AgentInfo>();

export function updateAgent(id: string, info: Partial<AgentInfo>): void {
  const existing = agents.get(id) || { id, hostname: "", lastPing: 0, version: "" };
  agents.set(id, { ...existing, ...info, lastPing: Date.now() });
}

export function getAgents(): AgentInfo[] {
  const now = Date.now();
  return Array.from(agents.values()).filter((a) => now - a.lastPing < 60000);
}
