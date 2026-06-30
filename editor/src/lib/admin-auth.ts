"use server";

import { cookies } from "next/headers";
import { createHash, randomBytes, timingSafeEqual } from "crypto";

const ADMIN_USER = "pathfinder";
const ADMIN_PASS = "2312";
const MAX_ATTEMPTS = 3;
const LOCKOUT_MS = 5 * 60 * 1000;
const SESSION_MS = 60 * 60 * 1000;

const SECRET =
  process.env.ADMIN_SECRET || randomBytes(32).toString("hex");

const attempts = new Map<string, { count: number; lockedUntil: number }>();

function signToken(payload: string): string {
  const hmac = createHash("sha256").update(payload + SECRET).digest("hex");
  return `${payload}.${hmac}`;
}

function verifyToken(token: string): string | null {
  const lastDot = token.lastIndexOf(".");
  if (lastDot === -1) return null;
  const payload = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);
  const expected = createHash("sha256").update(payload + SECRET).digest("hex");
  try {
    if (timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
      return payload;
    }
  } catch {
    return null;
  }
  return null;
}

export async function login(
  username: string,
  password: string
): Promise<{ ok: boolean; error?: string }> {
  const ip = "global";

  const record = attempts.get(ip);
  if (record && Date.now() < record.lockedUntil) {
    const remaining = Math.ceil((record.lockedUntil - Date.now()) / 1000);
    return { ok: false, error: `Account locked. Try again in ${remaining}s` };
  }

  if (username !== ADMIN_USER || password !== ADMIN_PASS) {
    const current = attempts.get(ip) ?? { count: 0, lockedUntil: 0 };
    current.count += 1;
    if (current.count >= MAX_ATTEMPTS) {
      current.lockedUntil = Date.now() + LOCKOUT_MS;
      attempts.set(ip, current);
      return { ok: false, error: "Account locked for 5 minutes (3 failed attempts)" };
    }
    attempts.set(ip, current);
    const remaining = MAX_ATTEMPTS - current.count;
    return { ok: false, error: `Invalid credentials. ${remaining} attempt${remaining > 1 ? "s" : ""} remaining` };
  }

  attempts.delete(ip);

  const expiry = Date.now() + SESSION_MS;
  const token = signToken(`${ADMIN_USER}:${expiry}`);
  const isProd = process.env.NODE_ENV === "production";

  const cookieStore = await cookies();
  cookieStore.set("admin_session", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/admin",
    maxAge: SESSION_MS / 1000,
  });

  return { ok: true };
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}

export async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!token) return false;

  const payload = verifyToken(token);
  if (!payload) return false;

  const parts = payload.split(":");
  if (parts.length < 2) return false;
  const username = parts[0];
  const expiry = parseInt(parts[1], 10);
  if (username !== ADMIN_USER) return false;
  if (Date.now() > expiry) return false;

  return true;
}
