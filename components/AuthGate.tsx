"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthed } from "@/lib/auth";

const PUBLIC_PATHS = new Set(["/login"]);

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = React.useState(false);

  React.useEffect(() => {
    if (PUBLIC_PATHS.has(pathname ?? "")) {
      setChecked(true);
      return;
    }
    if (!isAuthed()) {
      router.replace("/login");
    } else {
      setChecked(true);
    }
  }, [pathname, router]);

  if (!checked && !PUBLIC_PATHS.has(pathname ?? "")) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center text-zinc-500 text-sm">
        Checking access…
      </div>
    );
  }

  return <>{children}</>;
}
