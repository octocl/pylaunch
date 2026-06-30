"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WebLinksAddon } from "xterm-addon-web-links";
import "xterm/css/xterm.css";
import type { TerminalHandle } from "./terminal-panel";

interface XTermComponentProps {
  onReady?: (handle: TerminalHandle) => void;
}

export function XTermComponent({ onReady }: XTermComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const roRef = useRef<ResizeObserver | null>(null);
  const dataCallbackRef = useRef<((data: string) => void) | null>(null);
  const aliveRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  const writeGreeting = useCallback(() => {
    const term = xtermRef.current;
    if (!term) return;
    term.writeln("\x1b[1;32mPyLaunch Terminal\x1b[0m");
    term.writeln("Write Python code in the editor and press Run to execute.");
    term.writeln("\u2500".repeat(60));
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!containerRef.current || xtermRef.current || !mounted) return;

    const term = new Terminal({
      cursorBlink: true,
      cursorStyle: "block",
      theme: {
        background: "#101010",
        foreground: "#f2f2f2",
        cursor: "#00d992",
        selectionBackground: "#00d99233",
        black: "#1a1a1a",
        red: "#ef4444",
        green: "#22c55e",
        yellow: "#eab308",
        blue: "#3b82f6",
        magenta: "#a855f7",
        cyan: "#22d3ee",
        white: "#f2f2f2",
        brightBlack: "#3d3a39",
        brightRed: "#ef4444",
        brightGreen: "#22c55e",
        brightYellow: "#eab308",
        brightBlue: "#3b82f6",
        brightMagenta: "#a855f7",
        brightCyan: "#22d3ee",
        brightWhite: "#ffffff",
      },
      fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
      fontSize: 13,
      lineHeight: 1.4,
      allowTransparency: true,
      cols: 80,
      rows: 20,
      convertEol: true,
    });

    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();

    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);

    term.open(containerRef.current);
    fitAddonRef.current = fitAddon;
    xtermRef.current = term;
    aliveRef.current = true;

    const ro = new ResizeObserver(() => {
      if (!aliveRef.current) return;
      try {
        fitAddon.fit();
      } catch {
        /* container not yet laid out */
      }
    });
    ro.observe(containerRef.current);
    roRef.current = ro;

    requestAnimationFrame(() => {
      if (!aliveRef.current) return;
      try {
        fitAddon.fit();
        writeGreeting();
      } catch {
        /* container not yet laid out */
      }
    });

    term.onData((data) => {
      dataCallbackRef.current?.(data);
    });

    if (onReady) {
      onReady({
        write: (data: string) => term.write(data),
        writeln: (data: string) => term.writeln(data),
        clear: () => term.clear(),
        onData: (cb: (data: string) => void) => {
          dataCallbackRef.current = cb;
        },
      });
    }

    return () => {
      aliveRef.current = false;
      ro.disconnect();
      term.dispose();
      xtermRef.current = null;
      fitAddonRef.current = null;
    };
  }, [mounted, writeGreeting, onReady]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full"
    />
  );
}
