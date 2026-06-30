import { NextResponse } from "next/server";
import { getAgents, type AgentInfo } from "@/lib/agent-store";
import { getUsers } from "@/lib/user-store";

export const runtime = "nodejs";

export async function GET() {
  const agents = getAgents();

  let total = 0, used = 0, available = 0;
  const perAgent: AgentInfo[] = [];

  for (const a of agents) {
    if (!a.memory) continue;
    total += a.memory.total;
    used += a.memory.used;
    available += a.memory.available;
    perAgent.push(a);
  }

  const percent = total > 0 ? Math.round((used / total) * 1000) / 10 : 0;
  const userReserved = getUsers().reduce((s, u) => s + u.memoryLimit, 0);
  const userUsed = getUsers().reduce((s, u) => s + u.memoryUsed, 0);

  return NextResponse.json({
    total, used, available, percent,
    agents: perAgent,
    userReserved, userUsed,
  });
}
