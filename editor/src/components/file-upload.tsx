"use client";

import { useRef, useState, useCallback } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileLoad: (content: string, filename: string) => void;
  className?: string;
}

export function FileUpload({ onFileLoad, className }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const processFile = useCallback(
    (file: File) => {
      if (!file.name.endsWith(".py")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        onFileLoad(text, file.name);
      };
      reader.readAsText(file);
    },
    [onFileLoad]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".py"
        onChange={handleChange}
        className="hidden"
      />
      <button
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs font-medium transition-all",
          "text-muted-foreground hover:text-foreground border border-border hover:border-ring",
          dragOver && "border-primary bg-primary/10 text-primary",
          className
        )}
      >
        <Upload className="size-3.5" />
        <span>Upload .py</span>
      </button>
    </>
  );
}
