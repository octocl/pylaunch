export interface UserInfo {
  username: string;
  memoryUsed: number;
  memoryLimit: number;
  lastActive: number;
}

const users = new Map<string, UserInfo>();
const DEFAULT_LIMIT = 512 * 1024 * 1024;

export function getOrCreateUser(username: string): UserInfo {
  let u = users.get(username);
  if (!u) {
    u = { username, memoryUsed: 0, memoryLimit: DEFAULT_LIMIT, lastActive: 0 };
    users.set(username, u);
  }
  return u;
}

export function getUsers(): UserInfo[] {
  return Array.from(users.values()).sort((a, b) => b.lastActive - a.lastActive);
}

export function updateUserMemory(username: string, used: number): void {
  const u = getOrCreateUser(username);
  u.memoryUsed = used;
  u.lastActive = Date.now();
}

export function setUserLimit(username: string, limit: number): UserInfo {
  const u = getOrCreateUser(username);
  u.memoryLimit = limit;
  return u;
}
