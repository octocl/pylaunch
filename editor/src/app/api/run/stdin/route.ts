import { NextRequest, NextResponse } from "next/server";
import { getProcess } from "@/lib/process-store";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { taskId, data } = await req.json().catch(() => ({}));
  if (!taskId || typeof data !== "string") {
    return NextResponse.json({ error: "taskId and data required" }, { status: 400 });
  }

  const proc = getProcess(taskId);
  if (!proc || !proc.stdin) {
    return NextResponse.json({ error: "Process not found or already closed" }, { status: 404 });
  }

  proc.stdin.write(data);
  return NextResponse.json({ ok: true });
}
