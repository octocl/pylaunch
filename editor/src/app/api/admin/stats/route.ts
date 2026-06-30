import { NextResponse } from "next/server";
import { getAgents } from "@/lib/agent-store";
import { getTaskCount } from "@/lib/task-counter";

export const runtime = "nodejs";

let startTime = Date.now();

export async function GET() {
  return NextResponse.json({
    totalTasks: getTaskCount(),
    uptime: Math.floor((Date.now() - startTime) / 1000),
    agentCount: getAgents().length,
  });
}
