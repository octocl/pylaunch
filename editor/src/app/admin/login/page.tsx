"use client";

import { useState, useCallback, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Shield, Eye, EyeOff, Lock, User } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError("");
      setLoading(true);

      try {
        const res = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        const data = await res.json();
        if (data.ok) {
          router.push("/admin");
        } else {
          setError(data.error || "Login failed");
        }
      } catch {
        setError("Connection error");
      } finally {
        setLoading(false);
      }
    },
    [username, password, router]
  );

  return (
    <div className="min-h-screen bg-[#101010] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-[#00d992]/30 mb-4">
            <Shield className="size-7 text-[#00d992]" />
          </div>
          <h1 className="text-xl font-semibold text-[#f2f2f2] font-['Inter']">
            Admin Panel
          </h1>
          <p className="text-sm text-[#8b949e] mt-1 font-['Inter']">
            Sign in to manage your agents
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#1a1a1a] border border-[#3d3a39] rounded-lg p-6 space-y-4"
        >
          <div>
            <label className="block text-xs font-medium text-[#8b949e] mb-1.5 font-['Inter']">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#8b949e]" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#101010] border border-[#3d3a39] rounded-md pl-9 pr-3 py-2 text-sm text-[#f2f2f2] font-mono placeholder:text-[#8b949e] focus:outline-none focus:border-[#00d992] transition-colors"
                placeholder="Enter username"
                autoFocus
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#8b949e] mb-1.5 font-['Inter']">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#8b949e]" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#101010] border border-[#3d3a39] rounded-md pl-9 pr-10 py-2 text-sm text-[#f2f2f2] font-mono placeholder:text-[#8b949e] focus:outline-none focus:border-[#00d992] transition-colors"
                placeholder="Enter password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b949e] hover:text-[#f2f2f2] transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-800/40 rounded-md px-3 py-2">
              <p className="text-xs text-red-400 font-['Inter']">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !username || !password}
            className="w-full bg-[#00d992] text-[#101010] font-semibold text-sm py-2 rounded-md hover:bg-[#00d992]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-['Inter']"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
