"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trophy, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useGame } from "@/context/GameContext";
import { roleLabel } from "@/lib/game-logic";

const WINNER_LABEL = {
  civilians: "Civilians win",
  undercover: "Undercovers win",
  mr_white: "Mr. White wins",
} as const;

const WINNER_ACCENT = {
  civilians: "text-success",
  undercover: "text-accent",
  mr_white: "text-zinc-100",
} as const;

export default function EndPage() {
  const router = useRouter();
  const { state, reset } = useGame();

  React.useEffect(() => {
    if (state.phase !== "ended") router.replace("/");
  }, [state.phase, router]);

  if (state.phase !== "ended" || !state.winner) return null;

  return (
    <div className="flex-1 flex flex-col py-8 animate-fade-in">
      <header className="text-center mt-4">
        <div className="w-16 h-16 rounded-2xl bg-accent-muted/30 border border-accent/30 flex items-center justify-center mx-auto mb-5">
          <Trophy className="w-7 h-7 text-accent" />
        </div>
        <p className="text-xs uppercase tracking-wider text-zinc-500">Game over</p>
        <h1 className={`text-3xl font-bold mt-1 ${WINNER_ACCENT[state.winner]}`}>
          {WINNER_LABEL[state.winner]}
        </h1>
      </header>

      <section className="mt-10">
        <h2 className="text-xs uppercase tracking-wider text-zinc-500 ml-1 mb-3">Final roles</h2>
        <div className="space-y-2">
          {state.players.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3 rounded-xl bg-bg-surface border border-bg-border px-4 py-3"
            >
              <div className="flex-1 min-w-0">
                <div className="text-zinc-100 font-medium truncate">
                  {p.name} {!p.alive && <span className="text-zinc-600 text-xs">· out</span>}
                </div>
                {p.word && <div className="text-zinc-500 text-xs">{p.word}</div>}
              </div>
              <span
                className={[
                  "px-2.5 py-1 rounded-full text-xs font-medium",
                  p.role === "civilian"
                    ? "bg-success/15 text-success border border-success/30"
                    : p.role === "undercover"
                    ? "bg-accent/15 text-accent border border-accent/30"
                    : "bg-zinc-500/15 text-zinc-200 border border-zinc-500/30",
                ].join(" ")}
              >
                {roleLabel(p.role)}
              </span>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-auto pt-10 space-y-3">
        <Button
          size="lg"
          className="w-full"
          onClick={() => {
            reset();
            router.push("/game/setup");
          }}
        >
          <RotateCcw className="w-4 h-4" />
          Play again
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className="w-full"
          onClick={() => {
            reset();
            router.push("/");
          }}
        >
          <Home className="w-4 h-4" />
          Back to menu
        </Button>
      </div>
    </div>
  );
}
