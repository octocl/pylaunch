"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const ActionButton = () => {
  const [count, setCount] = useState(0);

  return (
    <div className={cn("flex flex-col items-center gap-4")}>
      <h1 className="text-2xl font-bold">Action Counter</h1>
      <h2 className="text-5xl font-bold text-primary">{count}</h2>
      <div className="flex gap-2">
        <Button onClick={() => setCount((prev) => prev - 1)}>-</Button>
        <Button onClick={() => setCount((prev) => prev + 1)}>+</Button>
      </div>
    </div>
  );
};
