import { NextRequest, NextResponse } from "next/server";
import { pushOutput } from "@/lib/agent-store";

export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;
  const body = await req.json().catch(() => ({}));
  pushOutput(taskId, body.stream || "stdout", body.data || "");
  return NextResponse.json({ ok: true });
}
