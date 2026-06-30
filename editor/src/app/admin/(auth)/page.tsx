"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  Server,
  Activity,
  Clock,
  LogOut,
  RefreshCw,
  Info,
  Cpu,
  Globe,
  Terminal,
  ExternalLink,
} from "lucide-react";

interface Agent {
  id: string;
  hostname: string;
  lastPing: number;
  version: string;
}

interface DashboardData {
  agents: Agent[];
  totalTasks: number;
  uptime: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [now, setNow] = useState(Date.now());
  const [loggingOut, setLoggingOut] = useState(false);

  const fetchDashboard = useCallback(async () => {
    try {
      const [agentsRes, statsRes] = await Promise.all([
        fetch("/api/agents"),
        fetch("/api/admin/stats"),
      ]);
      const agentsData = agentsRes.ok ? await agentsRes.json() : { agents: [] };
      const statsData = statsRes.ok ? await statsRes.json() : {};
      setData({
        agents: agentsData.agents ?? [],
        totalTasks: statsData.totalTasks ?? 0,
        uptime: statsData.uptime ?? 0,
      });
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
    const id = setInterval(fetchDashboard, 5000);
    return () => clearInterval(id);
  }, [fetchDashboard]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(id);
  }, []);

  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      /* ignore */
    }
    router.push("/admin/login");
  }, [router]);

  const timeAgo = (ts: number) => {
    const sec = Math.floor((now - ts) / 1000);
    if (sec < 60) return `${sec}s`;
    const min = Math.floor(sec / 60);
    return `${min}m`;
  };

  const agents = data?.agents ?? [];
  const online = agents.length;
  const uptime = data?.uptime ?? 0;
  const uptimeStr = uptime > 0
    ? `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`
    : "N/A";

  return (
    <div className="min-h-screen bg-[#101010]">
      <header className="border-b border-[#3d3a39] bg-[#1a1a1a] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-[#00d992]/10 border border-[#00d992]/20 flex items-center justify-center">
              <Shield className="size-4 text-[#00d992]" />
            </div>
            <div>
              <span className="text-sm font-semibold text-[#f2f2f2] font-['Inter']">
                Admin Panel
              </span>
              <span className="text-[10px] text-[#8b949e] ml-2 font-mono">v0.1</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-[#8b949e] font-mono">
              <Clock className="size-3" />
              {new Date(now).toLocaleTimeString()}
            </div>
            <button
              onClick={fetchDashboard}
              className="flex items-center gap-1 text-xs text-[#8b949e] hover:text-[#00d992] transition-colors font-['Inter']"
              title="Refresh"
            >
              <RefreshCw className="size-3.5" />
            </button>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-1.5 text-xs text-[#8b949e] hover:text-[#f2f2f2] transition-colors disabled:opacity-40 font-['Inter']"
            >
              <LogOut className="size-3.5" />
              {loggingOut ? "..." : "Sign out"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Metrics row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="bg-[#1a1a1a] border border-[#3d3a39] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-medium text-[#8b949e] uppercase tracking-wider font-['Inter']">
                Agents
              </span>
              <Server className="size-4 text-[#8b949e]" />
            </div>
            <p className="text-2xl font-bold text-[#f2f2f2] font-mono">
              {agents.length}
            </p>
            <p className="text-[10px] text-[#8b949e] mt-1 font-['Inter']">
              Total registered
            </p>
          </div>

          <div className="bg-[#1a1a1a] border border-[#3d3a39] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-medium text-[#8b949e] uppercase tracking-wider font-['Inter']">
                Online
              </span>
              <Activity className="size-4 text-[#00d992]" />
            </div>
            <p className="text-2xl font-bold text-[#00d992] font-mono">
              {online}
            </p>
            <p className="text-[10px] text-[#8b949e] mt-1 font-['Inter']">
              Healthy agents
            </p>
          </div>

          <div className="bg-[#1a1a1a] border border-[#3d3a39] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-medium text-[#8b949e] uppercase tracking-wider font-['Inter']">
                Tasks
              </span>
              <Terminal className="size-4 text-[#8b949e]" />
            </div>
            <p className="text-2xl font-bold text-[#f2f2f2] font-mono">
              {data?.totalTasks ?? 0}
            </p>
            <p className="text-[10px] text-[#8b949e] mt-1 font-['Inter']">
              Executed today
            </p>
          </div>

          <div className="bg-[#1a1a1a] border border-[#3d3a39] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-medium text-[#8b949e] uppercase tracking-wider font-['Inter']">
                Uptime
              </span>
              <Clock className="size-4 text-[#8b949e]" />
            </div>
            <p className="text-2xl font-bold text-[#f2f2f2] font-mono">
              {uptimeStr}
            </p>
            <p className="text-[10px] text-[#8b949e] mt-1 font-['Inter']">
              Server running
            </p>
          </div>
        </div>

        {/* Agent cards */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[#f2f2f2] font-['Inter']">
              Connected Agents
            </h2>
            <span className="text-[10px] text-[#8b949e] font-mono">
              {agents.length} agent{agents.length !== 1 ? "s" : ""}
            </span>
          </div>

          {agents.length === 0 ? (
            <div className="bg-[#1a1a1a] border border-[#3d3a39] rounded-xl p-12 text-center">
              <div className="size-12 rounded-full bg-[#3d3a39]/30 mx-auto flex items-center justify-center mb-4">
                <Globe className="size-6 text-[#3d3a39]" />
              </div>
              <p className="text-sm font-medium text-[#8b949e] font-['Inter'] mb-1">
                No agents connected
              </p>
              <p className="text-xs text-[#3d3a39] font-['Inter'] mb-6">
                Deploy an agent on your VPS to get started
              </p>
              <div className="inline-flex items-center gap-2 bg-[#101010] border border-[#3d3a39] rounded-lg px-4 py-2.5">
                <Cpu className="size-4 text-[#8b949e]" />
                <code className="text-xs text-[#8b949e] font-mono">
                  sudo bash setup-vps.sh
                </code>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {agents.map((a) => (
                <div
                  key={a.id}
                  className="bg-[#1a1a1a] border border-[#3d3a39] rounded-xl p-4 hover:border-[#00d992]/30 transition-colors group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <div className="size-8 rounded-lg bg-[#00d992]/10 border border-[#00d992]/20 flex items-center justify-center">
                          <Cpu className="size-4 text-[#00d992]" />
                        </div>
                        <div className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-[#00d992] shadow-[0_0_6px_#00d992] border-2 border-[#1a1a1a]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#f2f2f2] font-mono leading-tight">
                          {a.hostname}
                        </p>
                        <p className="text-[10px] text-[#8b949e] font-mono mt-0.5">
                          {a.id}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#8b949e] font-mono bg-[#101010] px-2 py-0.5 rounded-md border border-[#3d3a39]">
                      v{a.version}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#3d3a39] pt-3 mt-1">
                    <div className="flex items-center gap-1.5 text-[10px] text-[#8b949e] font-['Inter']">
                      <Clock className="size-3" />
                      <span>{timeAgo(a.lastPing)} ago</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] text-[#00d992] font-medium font-['Inter']">
                      <span className="size-1.5 rounded-full bg-[#00d992] animate-pulse" />
                      active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick info footer */}
        <div className="bg-[#1a1a1a] border border-[#3d3a39] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-[#8b949e] font-['Inter']">
              <Info className="size-3.5" />
              <span>
                Agents connect via HTTP polling every 10s. 
                Run <code className="bg-[#101010] px-1.5 py-0.5 rounded text-[10px] font-mono text-[#00d992]">sudo bash setup-vps.sh</code> on any VPS.
              </span>
            </div>
            <ExternalLink className="size-3.5 text-[#3d3a39]" />
          </div>
        </div>
      </main>
    </div>
  );
}
