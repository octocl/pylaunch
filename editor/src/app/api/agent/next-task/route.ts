import { NextRequest, NextResponse } from "next/server";
import { dequeueTask } from "@/lib/agent-store";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "missing id" }, { status: 400 });
  }

  const task = dequeueTask(id);
  if (task) {
    return NextResponse.json(task);
  }

  const deadline = Date.now() + 25000;
  while (Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const t = dequeueTask(id);
    if (t) {
      return NextResponse.json(t);
    }
  }

  return new NextResponse(null, { status: 204 });
}
