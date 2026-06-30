import { NextRequest, NextResponse } from "next/server";
import { getUsers, setUserLimit, updateUserMemory } from "@/lib/user-store";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ users: getUsers() });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { username, memoryLimit, memoryUsed } = body;

  if (!username) {
    return NextResponse.json({ error: "username required" }, { status: 400 });
  }

  if (memoryLimit !== undefined) {
    const limit = Number(memoryLimit);
    if (isNaN(limit) || limit < 0) {
      return NextResponse.json({ error: "invalid memoryLimit" }, { status: 400 });
    }
    setUserLimit(username, limit);
  }

  if (memoryUsed !== undefined) {
    const used = Number(memoryUsed);
    if (!isNaN(used) && used >= 0) {
      updateUserMemory(username, used);
    }
  }

  const user = getUsers().find((u) => u.username === username);
  return NextResponse.json({ ok: true, user });
}
