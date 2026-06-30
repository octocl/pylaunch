"use client";

import dynamic from "next/dynamic";
import { useRef, useCallback } from "react";

const XTerm = dynamic(
  () => import("./xterm-component").then((mod) => mod.XTermComponent),
  { ssr: false }
);

export interface TerminalHandle {
  write: (data: string) => void;
  writeln: (data: string) => void;
  clear: () => void;
  onData?: (cb: (data: string) => void) => void;
}

interface TerminalPanelProps {
  className?: string;
  onReady?: (handle: TerminalHandle) => void;
}

export function TerminalPanel({ className, onReady }: TerminalPanelProps) {
  const handleRef = useRef<TerminalHandle | null>(null);

  const handleReady = useCallback((handle: TerminalHandle) => {
    handleRef.current = handle;
    onReady?.(handle);
  }, [onReady]);

  return (
    <div className={className}>
      <XTerm onReady={handleReady} />
    </div>
  );
}
