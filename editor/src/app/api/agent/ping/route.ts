import { NextRequest, NextResponse } from "next/server";
import { updateAgent } from "@/lib/agent-store";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const id = body.id || "unknown";
  updateAgent(id, {
    hostname: body.hostname || id,
    version: body.version || "0.0.0",
  });
  return NextResponse.json({ ok: true });
}
