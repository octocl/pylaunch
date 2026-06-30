import { NextResponse } from "next/server";
import { networkInterfaces, hostname } from "os";

export const runtime = "nodejs";

export async function GET() {
  const nets = networkInterfaces();
  let ip = "localhost";
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === "IPv4" && !net.internal) {
        ip = net.address;
        break;
      }
    }
    if (ip !== "localhost") break;
  }
  return NextResponse.json({ ip, hostname: hostname() });
}
