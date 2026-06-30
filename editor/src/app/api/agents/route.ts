import { NextResponse } from "next/server";
import { getAgents } from "@/lib/agent-store";

export const runtime = "nodejs";

export async function GET() {
  const agents = getAgents();
  return NextResponse.json({ agents });
}
