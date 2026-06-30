import { NextRequest, NextResponse } from "next/server";
import { updateAgent } from "@/lib/agent-store";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  updateAgent(body.id || "unknown", {
    hostname: body.hostname || body.id || "unknown",
    version: body.version || "0.0.0",
    memory: body.memory,
    system: body.system,
  });
  return NextResponse.json({ ok: true });
}
