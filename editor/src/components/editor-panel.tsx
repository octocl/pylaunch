"use client";

import { useEffect, useRef, useState } from "react";

const DEFAULT_CODE = `def greet(name: str) -> str:
    return f"Hello, {name}!"


def main():
    name = input("Enter your name: ")
    print(greet(name))


if __name__ == "__main__":
    main()
`;

interface EditorPanelProps {
  initialCode?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}

export function EditorPanel({
  initialCode,
  onChange,
  readOnly = false,
}: EditorPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<ReturnType<typeof import("monaco-editor")["editor"]["create"]> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let disposed = false;

    const init = async () => {
      try {
        const monaco = await import("monaco-editor");

        if (disposed || !containerRef.current) return;

        monaco.editor.defineTheme("pylaunch-dark", {
          base: "vs-dark",
          inherit: true,
          rules: [
            { token: "comment", foreground: "8b949e" },
            { token: "keyword", foreground: "00d992" },
            { token: "string", foreground: "22c55e" },
            { token: "number", foreground: "f2f2f2" },
            { token: "type", foreground: "2fd6a1" },
            { token: "function", foreground: "f2f2f2" },
            { token: "variable", foreground: "f2f2f2" },
          ],
          colors: {
            "editor.background": "#101010",
            "editor.foreground": "#f2f2f2",
            "editor.lineHighlightBackground": "#1a1a1a",
            "editor.selectionBackground": "#00d99233",
            "editor.inactiveSelectionBackground": "#00d99222",
            "editorCursor.foreground": "#00d992",
            "editorLineNumber.foreground": "#3d3a39",
            "editorLineNumber.activeForeground": "#8b949e",
            "editorIndentGuide.background": "#1a1a1a",
            "editorIndentGuide.activeBackground": "#3d3a39",
            "editorBracketMatch.background": "#00d99222",
            "editorBracketMatch.border": "#00d992",
            "editorWidget.background": "#1a1a1a",
            "editorWidget.border": "#3d3a39",
            "editorSuggestWidget.background": "#1a1a1a",
            "editorSuggestWidget.border": "#3d3a39",
            "editorSuggestWidget.selectedBackground": "#00d99222",
            "minimap.background": "#101010",
          },
        });

        const ed = monaco.editor.create(containerRef.current, {
          value: initialCode ?? DEFAULT_CODE,
          language: "python",
          theme: "pylaunch-dark",
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
          lineNumbers: "on",
          renderLineHighlight: "line",
          scrollBeyondLastLine: false,
          tabSize: 4,
          readOnly,
          padding: { top: 12 },
          automaticLayout: true,
          bracketPairColorization: { enabled: true },
          suggestOnTriggerCharacters: true,
          wordWrap: "on",
        });

        editorRef.current = ed;

        ed.onDidChangeModelContent(() => {
          onChange?.(ed.getValue());
        });

        ed.focus();
      } catch (e) {
        if (!disposed) {
          setError(e instanceof Error ? e.message : "Failed to load editor");
        }
      }
    };

    init();

    return () => {
      disposed = true;
      editorRef.current?.dispose();
      editorRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <div className="h-full w-full">
        <textarea
          defaultValue={initialCode ?? DEFAULT_CODE}
          onChange={(e) => onChange?.(e.target.value)}
          readOnly={readOnly}
          className="w-full h-full bg-[#101010] text-[#f2f2f2] font-mono text-sm p-3 border-0 resize-none focus:outline-none"
          spellCheck={false}
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-full w-full" />
  );
}
