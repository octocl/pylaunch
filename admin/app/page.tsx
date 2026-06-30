"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Cpu, MemoryStick, Activity, UsersRound, Gauge,
  RefreshCw, Globe, Info, Copy, Check,
  Terminal, Wifi,
} from "lucide-react";

interface MemoryInfo { total: number; used: number; available: number; percent: number }
interface SystemInfo { os: string; cpu: number; disk_total: number; disk_used: number }
interface Agent { id: string; hostname: string; lastPing: number; version: string; memory?: MemoryInfo; system?: SystemInfo }
interface AppUser { username: string; memoryUsed: number; memoryLimit: number; lastActive: number }

function fmtBytes(b: number): string {
  if (!b) return "0 B";
  const u = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(b) / Math.log(1024));
  return (b / Math.pow(1024, i)).toFixed(1) + " " + u[i];
}

function timeAgo(ts: number, now: number): string {
  const s = Math.floor((now - ts) / 1000);
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m`;
}

export default function Page() {
  const [mem, setMem] = useState<{ total: number; used: number; available: number; percent: number; agents: Agent[]; userReserved: number; userUsed: number } | null>(null);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [now, setNow] = useState(Date.now());
  const [editing, setEditing] = useState<string | null>(null);
  const [editVal, setEditVal] = useState("");
  const [copied, setCopied] = useState(false);
  const [notif, setNotif] = useState<string | null>(null);
  const prevCount = useRef(0);

  const fetchAll = useCallback(async () => {
    const [memRes, usersRes] = await Promise.all([
      fetch("/api/admin/memory"),
      fetch("/api/admin/users"),
    ]);
    const memData = memRes.ok ? await memRes.json() : null;
    const usersData = usersRes.ok ? await usersRes.json() : { users: [] };
    setUsers(usersData.users ?? []);
    if (memData) {
      setMem((prev) => {
        const prevCount = prev?.agents?.length ?? 0;
        const newCount = memData.agents?.length ?? 0;
        if (newCount > prevCount) {
          const newAgents = memData.agents.slice(prevCount);
          const names = newAgents.map((a: Agent) => a.hostname).join(", ");
          setNotif(`New agent${newAgents.length > 1 ? "s" : ""} connected: ${names}`);
          setTimeout(() => setNotif(null), 5000);
        }
        return memData;
      });
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const id = setInterval(fetchAll, 5000);
    return () => clearInterval(id);
  }, [fetchAll]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(id);
  }, []);

  const setLimit = async (username: string) => {
    const mb = parseFloat(editVal);
    if (isNaN(mb) || mb < 0) return;
    await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, memoryLimit: mb * 1024 * 1024 }),
    });
    setEditing(null);
    fetchAll();
  };

  const agents = mem?.agents ?? [];
  const connCmd = `bash <(curl -sL https://raw.githubusercontent.com/octocl/pylaunch/main/admin/public/setup-agent.sh) -- https://your-server.com`;

  return (
    <div className="min-h-screen bg-[#101010] p-6 max-w-7xl mx-auto">
      {/* Notification */}
      {notif && (
        <div className="fixed top-4 right-4 z-50 bg-[#00d992]/10 border border-[#00d992]/30 rounded-xl px-5 py-3 shadow-2xl backdrop-blur-sm animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-sm text-[#00d992]">
            <Wifi className="size-4" />
            <span>{notif}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-[#00d992]/10 border border-[#00d992]/20 flex items-center justify-center">
            <Cpu className="size-4 text-[#00d992]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#f2f2f2]">PyLaunch Resource Manager</h1>
            <p className="text-[10px] text-[#8b949e] font-mono">{agents.length} agent{agents.length !== 1 ? "s" : ""} connected</p>
          </div>
        </div>
        <button onClick={fetchAll} className="text-[#8b949e] hover:text-[#00d992] transition-colors" title="Refresh">
          <RefreshCw className="size-4" />
        </button>
      </header>

      {/* Connect command */}
      <div className="bg-[#1a1a1a] border border-[#3d3a39] rounded-xl p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Terminal className="size-4 text-[#00d992]" />
          <h2 className="text-sm font-semibold text-[#f2f2f2]">Connect a machine</h2>
          <span className="text-[10px] text-[#8b949e] ml-auto">Paste this on any VPS as root</span>
        </div>
        <div className="flex items-center gap-2 bg-[#101010] border border-[#3d3a39] rounded-lg px-4 py-3">
          <code className="flex-1 text-xs text-[#f2f2f2] font-mono break-all">{connCmd}</code>
          <button
            onClick={() => { navigator.clipboard.writeText(connCmd); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            className="shrink-0 text-[#8b949e] hover:text-[#00d992] transition-colors"
          >
            {copied ? <Check className="size-4 text-[#00d992]" /> : <Copy className="size-4" />}
          </button>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <Metric icon={<MemoryStick className="size-4" />} label="Total Memory" value={mem ? fmtBytes(mem.total) : "—"} sub="Aggregated" />
        <Metric icon={<Activity className="size-4" />} label="Used" value={mem ? fmtBytes(mem.used) : "—"} sub={mem ? `${mem.percent}%` : "—"} color="#e5484d" />
        <Metric icon={<Gauge className="size-4" />} label="Available" value={mem ? fmtBytes(mem.available) : "—"} sub="Free" color="#00d992" />
        <Metric icon={<UsersRound className="size-4" />} label="Users" value={String(users.length)} sub={`${agents.length} agent${agents.length !== 1 ? "s" : ""}`} />
      </div>

      {/* System Memory gauge */}
      {mem && (
        <section className="bg-[#1a1a1a] border border-[#3d3a39] rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#f2f2f2]">System Memory</h2>
            <span className="text-[10px] text-[#8b949e] font-mono">{fmtBytes(mem.used)} / {fmtBytes(mem.total)}</span>
          </div>
          <div className="space-y-2">
            <div className="relative h-6 bg-[#101010] rounded-full overflow-hidden border border-[#3d3a39]">
              <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#00d992] via-[#e5b83a] to-[#e5484d] rounded-full transition-all duration-500" style={{ width: `${Math.min(mem.percent, 100)}%` }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[11px] font-mono font-bold text-[#f2f2f2] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">{mem.percent}%</span>
              </div>
            </div>
            <div className="flex items-center gap-6 text-[10px] text-[#8b949e]">
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-[#00d992]" /> Used ({fmtBytes(mem.used)})</span>
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-[#101010] border border-[#3d3a39]" /> Available ({fmtBytes(mem.available)})</span>
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-[#3d3a39]" /> Reserved ({fmtBytes(mem.userReserved)})</span>
            </div>
          </div>
        </section>
      )}

      {/* Agent cards with system info */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[#f2f2f2]">Machines</h2>
          <span className="text-[10px] text-[#8b949e] font-mono">{agents.length} machine{agents.length !== 1 ? "s" : ""}</span>
        </div>
        {agents.length === 0 ? (
          <div className="bg-[#1a1a1a] border border-[#3d3a39] rounded-xl p-12 text-center">
            <div className="size-12 rounded-full bg-[#3d3a39]/30 mx-auto flex items-center justify-center mb-4">
              <Globe className="size-6 text-[#3d3a39]" />
            </div>
            <p className="text-sm font-medium text-[#8b949e] mb-1">No machines connected</p>
            <p className="text-xs text-[#3d3a39]">Run the connect command above on any VPS</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {agents.map((a) => (
              <div key={a.id} className="bg-[#1a1a1a] border border-[#3d3a39] rounded-xl p-4 hover:border-[#00d992]/30 transition-colors">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="size-8 rounded-lg bg-[#00d992]/10 border border-[#00d992]/20 flex items-center justify-center">
                    <Cpu className="size-4 text-[#00d992]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#f2f2f2] font-mono leading-tight truncate">{a.hostname}</p>
                    <p className="text-[10px] text-[#8b949e] font-mono flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-[#00d992] inline-block" />
                      {timeAgo(a.lastPing, now)} ago
                    </p>
                  </div>
                </div>

                {/* Memory bar */}
                {a.memory && (
                  <div className="mb-3">
                    <div className="h-2 bg-[#101010] rounded-full overflow-hidden border border-[#3d3a39] mb-1">
                      <div className="h-full bg-[#00d992] rounded-full transition-all duration-500" style={{ width: `${Math.min(a.memory.percent, 100)}%` }} />
                    </div>
                    <div className="flex justify-between text-[10px] text-[#8b949e]">
                      <span>{a.memory.percent}%</span>
                      <span className="font-mono">{fmtBytes(a.memory.used)} / {fmtBytes(a.memory.total)}</span>
                    </div>
                  </div>
                )}

                {/* OS / CPU / Disk */}
                {a.system && (
                  <div className="grid grid-cols-3 gap-2 text-[10px] pt-2 border-t border-[#3d3a39]/50">
                    <div className="text-[#8b949e] truncate" title={a.system.os}>
                      <span className="block text-[9px] uppercase tracking-wider text-[#3d3a39] mb-0.5">OS</span>
                      {a.system.os.length > 14 ? a.system.os.slice(0, 14) + "…" : a.system.os}
                    </div>
                    <div className="text-[#8b949e]">
                      <span className="block text-[9px] uppercase tracking-wider text-[#3d3a39] mb-0.5">CPU</span>
                      {a.system.cpu} cores
                    </div>
                    <div className="text-[#8b949e]">
                      <span className="block text-[9px] uppercase tracking-wider text-[#3d3a39] mb-0.5">Disk</span>
                      {fmtBytes(a.system.disk_used)} / {fmtBytes(a.system.disk_total)}
                    </div>
                  </div>
                )}

                {!a.system && (
                  <div className="pt-2 border-t border-[#3d3a39]/50 text-[10px] text-[#3d3a39] italic">
                    No system info yet — waiting for next heartbeat
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Per-user memory */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[#f2f2f2]">Per-User Memory</h2>
          <span className="text-[10px] text-[#8b949e] font-mono">{users.length} user{users.length !== 1 ? "s" : ""}</span>
        </div>
        {users.length === 0 ? (
          <div className="bg-[#1a1a1a] border border-[#3d3a39] rounded-xl p-12 text-center">
            <div className="size-12 rounded-full bg-[#3d3a39]/30 mx-auto flex items-center justify-center mb-4">
              <UsersRound className="size-6 text-[#3d3a39]" />
            </div>
            <p className="text-sm text-[#8b949e]">No users yet. They appear when code runs.</p>
          </div>
        ) : (
          <div className="bg-[#1a1a1a] border border-[#3d3a39] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#3d3a39]">
                  <th className="text-left text-[10px] font-medium text-[#8b949e] uppercase tracking-wider px-4 py-3">User</th>
                  <th className="text-left text-[10px] font-medium text-[#8b949e] uppercase tracking-wider px-4 py-3">Used</th>
                  <th className="text-left text-[10px] font-medium text-[#8b949e] uppercase tracking-wider px-4 py-3">Limit</th>
                  <th className="text-left text-[10px] font-medium text-[#8b949e] uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Usage</th>
                  <th className="text-right text-[10px] font-medium text-[#8b949e] uppercase tracking-wider px-4 py-3">Edit</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const pct = u.memoryLimit > 0 ? Math.round((u.memoryUsed / u.memoryLimit) * 100) : 0;
                  const barColor = pct > 80 ? "#e5484d" : pct > 50 ? "#e5b83a" : "#00d992";
                  return (
                    <tr key={u.username} className="border-b border-[#3d3a39]/50 last:border-0 hover:bg-[#101010]/50 transition-colors">
                      <td className="px-4 py-3"><span className="text-sm font-mono text-[#f2f2f2]">{u.username}</span></td>
                      <td className="px-4 py-3"><span className="text-xs font-mono text-[#8b949e]">{fmtBytes(u.memoryUsed)}</span></td>
                      <td className="px-4 py-3">
                        {editing === u.username ? (
                          <div className="flex items-center gap-1.5">
                            <input type="number" value={editVal} onChange={(e) => setEditVal(e.target.value)}
                              className="w-20 bg-[#101010] border border-[#3d3a39] rounded px-2 py-1 text-xs text-[#f2f2f2] font-mono outline-none focus:border-[#00d992]" min="0" autoFocus />
                            <span className="text-[10px] text-[#8b949e]">MB</span>
                            <button onClick={() => setLimit(u.username)} className="text-[10px] text-[#00d992] hover:text-[#00d992]/80">Save</button>
                            <button onClick={() => setEditing(null)} className="text-[10px] text-[#8b949e] hover:text-[#f2f2f2]">X</button>
                          </div>
                        ) : (
                          <span className="text-xs font-mono text-[#f2f2f2]">{fmtBytes(u.memoryLimit)}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-[#101010] rounded-full overflow-hidden border border-[#3d3a39]">
                            <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: barColor }} />
                          </div>
                          <span className="text-[10px] font-mono" style={{ color: barColor }}>{pct}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => { setEditing(u.username); setEditVal(String(u.memoryLimit / (1024 * 1024))); }}
                          className="text-[10px] text-[#8b949e] hover:text-[#00d992] transition-colors">Edit limit</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] border border-[#3d3a39] rounded-xl p-4">
        <div className="flex items-center gap-2 text-xs text-[#8b949e]">
          <Info className="size-3.5 shrink-0" />
          <span>Available: <code className="bg-[#101010] px-1.5 py-0.5 rounded text-[10px] font-mono text-[#00d992]">{mem ? fmtBytes(mem.available) : "—"}</code>. Refresh every 5s.</span>
        </div>
      </footer>
    </div>
  );
}

function Metric({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string; sub: string; color?: string }) {
  return (
    <div className="bg-[#1a1a1a] border border-[#3d3a39] rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-medium text-[#8b949e] uppercase tracking-wider">{label}</span>
        <span style={{ color: color ?? "#8b949e" }}>{icon}</span>
      </div>
      <p className="text-2xl font-bold font-mono" style={{ color: color ?? "#f2f2f2" }}>{value}</p>
      <p className="text-[10px] text-[#8b949e] mt-1">{sub}</p>
    </div>
  );
}
