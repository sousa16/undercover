"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, X, Minus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { useGame } from "@/context/GameContext";
import {
  defaultRoleCounts,
  validateRoleCounts,
  type RoleCounts,
} from "@/lib/game-logic";
import { supabase } from "@/lib/supabase";
import { randomFrom } from "@/lib/utils";

export default function SetupPage() {
  const router = useRouter();
  const { startGame } = useGame();
  const [names, setNames] = React.useState<string[]>(["", "", ""]);
  const [counts, setCounts] = React.useState<RoleCounts>(defaultRoleCounts(3));
  const [customized, setCustomized] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const validNames = names.map((n) => n.trim()).filter(Boolean);
  const playerCount = validNames.length;

  React.useEffect(() => {
    if (!customized) setCounts(defaultRoleCounts(playerCount));
  }, [playerCount, customized]);

  function setName(i: number, v: string) {
    setNames((arr) => arr.map((n, idx) => (idx === i ? v : n)));
  }

  function addPlayer() {
    if (names.length >= 16) return;
    setNames((arr) => [...arr, ""]);
  }

  function removePlayer(i: number) {
    if (names.length <= 3) return;
    setNames((arr) => arr.filter((_, idx) => idx !== i));
  }

  function bump(key: keyof RoleCounts, delta: number) {
    setCustomized(true);
    setCounts((c) => ({ ...c, [key]: Math.max(0, c[key] + delta) }));
  }

  async function start() {
    setError(null);
    if (validNames.length < 3) return setError("Need at least 3 players.");
    const dup = new Set<string>();
    for (const n of validNames) {
      const k = n.toLowerCase();
      if (dup.has(k)) return setError("Player names must be unique.");
      dup.add(k);
    }
    const issue = validateRoleCounts(counts, validNames.length);
    if (issue) return setError(issue);

    setLoading(true);
    const { data, error } = await supabase.from("word_pairs").select("*");
    if (error) {
      setLoading(false);
      return setError(error.message);
    }
    if (!data || data.length === 0) {
      setLoading(false);
      return setError("No word pairs in the pool. Add some via Suggest.");
    }
    const pair = randomFrom(data);
    startGame(validNames, counts, {
      word_civilian: pair.word_civilian,
      word_undercover: pair.word_undercover,
    });
    router.push("/game/reveal");
  }

  return (
    <div className="flex-1 flex flex-col py-6 animate-fade-in">
      <header className="flex items-center gap-3 mb-6">
        <Link href="/" className="tap-target -ml-2 p-2 text-zinc-400 hover:text-zinc-100">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-semibold">New game</h1>
      </header>

      <section className="space-y-2 mb-6">
        <h2 className="text-xs uppercase tracking-wider text-zinc-500 ml-1 mb-2">
          Players ({playerCount})
        </h2>
        {names.map((name, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              placeholder={`Player ${i + 1}`}
              value={name}
              onChange={(e) => setName(i, e.target.value)}
            />
            <button
              onClick={() => removePlayer(i)}
              disabled={names.length <= 3}
              className="tap-target p-2 text-zinc-500 hover:text-danger disabled:opacity-30"
              aria-label="Remove player"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
        <button
          onClick={addPlayer}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-bg-border text-zinc-400 hover:text-zinc-100 hover:border-accent/60 tap-target"
        >
          <Plus className="w-4 h-4" />
          Add player
        </button>
      </section>

      <section className="mb-8">
        <h2 className="text-xs uppercase tracking-wider text-zinc-500 ml-1 mb-2">Roles</h2>
        <Card className="p-4 space-y-3">
          <RoleRow label="Undercovers" value={counts.undercovers} onChange={(d) => bump("undercovers", d)} accent />
          <RoleRow label="Mr. Whites" value={counts.mrWhites} onChange={(d) => bump("mrWhites", d)} />
          <RoleRow label="Civilians" value={counts.civilians} onChange={(d) => bump("civilians", d)} />
        </Card>
        {customized && (
          <button
            onClick={() => {
              setCustomized(false);
              setCounts(defaultRoleCounts(playerCount));
            }}
            className="text-xs text-zinc-500 mt-2 ml-1 hover:text-zinc-200"
          >
            Reset to default
          </button>
        )}
      </section>

      {error && (
        <div className="rounded-xl bg-danger/10 border border-danger/30 px-3 py-2 text-danger text-sm mb-3">
          {error}
        </div>
      )}

      <Button size="lg" className="w-full mt-auto" onClick={start} disabled={loading}>
        {loading ? "Drawing a pair…" : "Start game"}
      </Button>
    </div>
  );
}

function RoleRow({
  label,
  value,
  onChange,
  accent,
}: {
  label: string;
  value: number;
  onChange: (delta: number) => void;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={accent ? "text-accent text-sm" : "text-zinc-200 text-sm"}>{label}</span>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(-1)}
          className="tap-target w-9 h-9 rounded-lg bg-bg-elevated border border-bg-border text-zinc-300 flex items-center justify-center hover:border-accent/60"
          aria-label={`Decrease ${label}`}
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-6 text-center text-zinc-100 font-medium">{value}</span>
        <button
          onClick={() => onChange(1)}
          className="tap-target w-9 h-9 rounded-lg bg-bg-elevated border border-bg-border text-zinc-300 flex items-center justify-center hover:border-accent/60"
          aria-label={`Increase ${label}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
