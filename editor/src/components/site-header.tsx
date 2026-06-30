import { Terminal } from "lucide-react";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-background shrink-0">
      <Link href="/" className="flex items-center gap-2 text-foreground no-underline">
        <Terminal className="size-5 text-primary" />
        <span className="font-semibold text-sm">PyLaunch</span>
      </Link>
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors no-underline"
        >
          Home
        </Link>
        <Link
          href="/dashboard"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors no-underline"
        >
          Dashboard
        </Link>
      </div>
    </header>
  );
}
