"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { supabase } from "@/lib/supabase";

export default function SuggestPage() {
  const [civilian, setCivilian] = React.useState("");
  const [undercover, setUndercover] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const a = civilian.trim();
    const b = undercover.trim();
    if (!a || !b) return setError("Both words are required.");
    if (a.toLowerCase() === b.toLowerCase()) {
      return setError("The two words must differ.");
    }
    setSubmitting(true);
    const { error } = await supabase
      .from("word_pairs")
      .insert({ word_civilian: a, word_undercover: b });
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
    setCivilian("");
    setUndercover("");
  }

  return (
    <div className="flex-1 flex flex-col py-6 animate-fade-in">
      <header className="flex items-center gap-3 mb-8">
        <Link href="/" className="tap-target -ml-2 p-2 text-zinc-400 hover:text-zinc-100">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-semibold">Suggest a pair</h1>
      </header>

      <p className="text-zinc-500 text-sm mb-6">
        Two words that feel close but distinct. Civilians get the first, undercovers the second.
      </p>

      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="text-xs uppercase tracking-wider text-zinc-500 ml-1">
            Civilian word
          </label>
          <Input
            value={civilian}
            placeholder="e.g. Laptop"
            onChange={(e) => setCivilian(e.target.value)}
            autoFocus
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-zinc-500 ml-1">
            Undercover word
          </label>
          <Input
            value={undercover}
            placeholder="e.g. Tablet"
            onChange={(e) => setUndercover(e.target.value)}
          />
        </div>

        {error && <p className="text-danger text-sm pl-1">{error}</p>}
        {done && (
          <div className="flex items-center gap-2 rounded-xl bg-success/10 border border-success/30 px-3 py-2 text-success text-sm">
            <Check className="w-4 h-4" />
            Pair submitted. Thanks!
          </div>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit pair"}
        </Button>
      </form>
    </div>
  );
}
