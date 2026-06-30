import { ActionButton } from "@/components/ui/action-button";

export default function Demo() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex max-w-sm items-center justify-center rounded-none border-2 border-border bg-background p-8">
        <ActionButton />
      </div>
    </div>
  );
}
