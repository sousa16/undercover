"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, Props>(function Input(
  { className, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full h-12 px-4 rounded-xl bg-bg-elevated border border-bg-border",
        "text-zinc-100 placeholder:text-zinc-500 text-[15px]",
        "transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30",
        className,
      )}
      {...rest}
    />
  );
});
