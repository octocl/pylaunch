"use client";

import { useCallback, useState, useRef } from "react";
import { SiteHeader } from "@/components/site-header";
import { EditorPanel } from "@/components/editor-panel";
import { TerminalPanel } from "@/components/terminal-panel";
import type { TerminalHandle } from "@/components/terminal-panel";
import { RunButton } from "@/components/run-button";
import { StatusFooter } from "@/components/status-footer";
import { FileUpload } from "@/components/file-upload";
import { EnvVars } from "@/components/env-vars";
import { TargetSelector } from "@/components/target-selector";
import { AdBanner } from "@/components/ad-banner";
import { Button } from "@/components/ui/button";
import type { ExecutionStatus } from "@/lib/execution";

export default function EditorPage() {
  const [filename, setFilename] = useState("main.py");
  const [fileKey, setFileKey] = useState(0);
  const [status, setStatus] = useState<ExecutionStatus>({
    state: "idle",
    message: "",
  });
  const terminalRef = useRef<TerminalHandle | null>(null);
  const cancelledRef = useRef(false);
  const codeRef = useRef("");
  const envRef = useRef<Record<string, string>>({});
  const targetRef = useRef("local");
  const abortRef = useRef<AbortController | null>(null);
  const taskIdRef = useRef<string | null>(null);

  const handleEditorChange = useCallback((value: string) => {
    codeRef.current = value;
  }, []);

  const handleRun = useCallback(async () => {
    const code = codeRef.current;
    const term = terminalRef.current;

    if (!code) {
      term?.writeln("\x1b[1;31mNothing to run — editor is empty\x1b[0m");
      return;
    }

    cancelledRef.current = false;
    taskIdRef.current = null;
    setStatus({ state: "starting", message: "Starting..." });

    term?.clear();
    term?.writeln("\x1b[1;32mStarting execution...\x1b[0m");
    term?.writeln(`\x1b[1;33mFile:\x1b[0m ${filename}`);
    term?.writeln("");

    const abort = new AbortController();
    abortRef.current = abort;

    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code, env: envRef.current, timeout: 30, target: targetRef.current }),
        signal: abort.signal,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        term?.writeln(`\x1b[1;31mError: ${err.error}\x1b[0m`);
        setStatus({ state: "error", message: "Execution failed" });
        return;
      }

      setStatus({ state: "running", message: "Running...", duration: 0 });

      const reader = res.body?.getReader();
      if (!reader) {
        term?.writeln("\x1b[1;31mNo response stream\x1b[0m");
        setStatus({ state: "error", message: "No response stream" });
        return;
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const msg = JSON.parse(line);
            switch (msg.event) {
              case "stdout":
                term?.write(msg.data as string);
                break;
              case "stderr":
                term?.write(`\x1b[1;31m${msg.data as string}\x1b[0m`);
                break;
              case "task_start": {
                const tid = msg.taskId as string;
                taskIdRef.current = tid;
                term?.onData?.((data: string) => {
                  fetch("/api/run/stdin", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ taskId: tid, data }),
                  }).catch(() => {});
                });
                break;
              }
              case "agent_start":
                term?.writeln(
                  `\x1b[1;36mRunning on remote agent: ${msg.hostname as string}\x1b[0m`
                );
                term?.writeln("");
                break;
              case "exit": {
                const code = msg.code as number;
                if (code === 0) {
                  term?.writeln("");
                  term?.writeln(
                    `\x1b[1;32mExit code: ${code}\x1b[0m`
                  );
                  setStatus({
                    state: "completed",
                    message: `Completed`,
                    exitCode: code,
                  });
                } else {
                  term?.writeln("");
                  term?.writeln(
                    `\x1b[1;31mExit code: ${code}\x1b[0m`
                  );
                  setStatus({
                    state: "failed",
                    message: `Failed — exit code ${code}`,
                    exitCode: code,
                  });
                }
                break;
              }
              case "timeout":
                term?.writeln("");
                term?.writeln("\x1b[1;33mTimed out — 30s limit\x1b[0m");
                setStatus({
                  state: "timed_out",
                  message: "Timed out — 30s limit",
                });
                break;
              case "error":
                term?.writeln(
                  `\x1b[1;31mError: ${msg.message as string}\x1b[0m`
                );
                setStatus({ state: "error", message: "Execution error" });
                break;
            }
          } catch {
            // skip malformed lines
          }
        }
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        term?.writeln("\x1b[1;31mExecution cancelled\x1b[0m");
        setStatus({ state: "idle", message: "" });
      } else {
        term?.writeln(
          `\x1b[1;31mConnection error: ${(err as Error).message}\x1b[0m`
        );
        setStatus({ state: "error", message: "Connection error" });
      }
    } finally {
      abortRef.current = null;
    }
  }, [filename]);

  const handleStop = useCallback(() => {
    cancelledRef.current = true;
    abortRef.current?.abort();
    terminalRef.current?.writeln("\x1b[1;31mStopping...\x1b[0m");
    setStatus({ state: "idle", message: "" });
  }, []);

  const handleFileLoad = useCallback(
    (content: string, name: string) => {
      codeRef.current = content;
      setFilename(name);
      setFileKey((k) => k + 1);
    },
    []
  );

  const handleNew = useCallback(() => {
    codeRef.current = "";
    setFilename("main.py");
    setFileKey((k) => k + 1);
  }, []);

  const handleTerminalReady = useCallback((handle: TerminalHandle) => {
    terminalRef.current = handle;
  }, []);

  const handleEnvChange = useCallback((vars: Record<string, string>) => {
    envRef.current = vars;
  }, []);

  const handleTargetChange = useCallback((target: string) => {
    targetRef.current = target;
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background">
      <SiteHeader />

      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleNew}>
            New file
          </Button>
          <span className="text-xs text-muted-foreground font-mono">
            {filename}
          </span>
          <FileUpload onFileLoad={handleFileLoad} />
          <EnvVars onEnvChange={handleEnvChange} />
          <TargetSelector onTargetChange={handleTargetChange} />
        </div>
        <div className="flex items-center gap-2">
          <RunButton state={status.state} onRun={handleRun} onStop={handleStop} />
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        <div className="flex-1 min-w-0 border-r border-border">
          <EditorPanel
            key={fileKey}
            initialCode={codeRef.current || undefined}
            onChange={handleEditorChange}
          />
        </div>
        <div className="flex flex-col w-2/5 min-w-[320px]">
          <TerminalPanel
            className="flex-1 min-h-0"
            onReady={handleTerminalReady}
          />
          <AdBanner />
        </div>
      </div>

      <StatusFooter status={status} />
    </div>
  );
}
