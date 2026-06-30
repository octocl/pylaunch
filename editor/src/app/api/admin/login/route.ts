import { NextRequest, NextResponse } from "next/server";
import { login } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json().catch(() => ({}));
  const result = await login(username || "", password || "");
  return NextResponse.json(result);
}
