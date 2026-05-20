"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-bg-surface border border-bg-border p-5",
        className,
      )}
      {...rest}
    />
  );
}
