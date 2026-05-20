"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { authenticate, isAuthed } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isAuthed()) router.replace("/");
  }, [router]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (authenticate(password)) {
      router.replace("/");
    } else {
      setError("Wrong password.");
    }
  }

  return (
    <div className="flex-1 flex flex-col justify-center items-center py-12 animate-fade-in">
      <div className="w-14 h-14 rounded-2xl bg-accent-muted/40 border border-accent/30 flex items-center justify-center mb-6">
        <Lock className="w-6 h-6 text-accent" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">Undercover</h1>
      <p className="text-zinc-500 text-sm mt-1 mb-8">Private group access</p>

      <form onSubmit={submit} className="w-full space-y-3">
        <Input
          type="password"
          autoFocus
          placeholder="Group password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(null);
          }}
        />
        {error && <p className="text-danger text-sm pl-1">{error}</p>}
        <Button type="submit" size="lg" className="w-full">
          Enter
        </Button>
      </form>
    </div>
  );
}
