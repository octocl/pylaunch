import { NextRequest, NextResponse } from "next/server";
import { resolveTask } from "@/lib/agent-store";

export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;
  const body = await req.json().catch(() => ({}));
  resolveTask(taskId, { exitCode: body.exitCode ?? -1 });
  return NextResponse.json({ ok: true });
}
