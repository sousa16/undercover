"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useGame } from "@/context/GameContext";

export default function RoundPage() {
  const router = useRouter();
  const { state, openVote } = useGame();

  React.useEffect(() => {
    if (state.phase === "idle") router.replace("/game/setup");
    else if (state.phase === "reveal") router.replace("/game/reveal");
    else if (state.phase === "vote") router.replace("/game/vote");
    else if (state.phase === "mr_white_guess") router.replace("/game/mr-white");
    else if (state.phase === "ended") router.replace("/game/end");
  }, [state.phase, router]);

  if (state.phase !== "round") return null;

  const starter = state.players.find((p) => p.id === state.startingPlayerId);
  const alive = state.players.filter((p) => p.alive);

  return (
    <div className="flex-1 flex flex-col py-6 animate-fade-in">
      <header className="mb-6 text-center">
        <p className="text-xs uppercase tracking-wider text-zinc-500">Round {state.round}</p>
        <h1 className="text-2xl font-semibold mt-1">Description phase</h1>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-accent-muted/30 border border-accent/30 flex items-center justify-center mb-5">
          <Sparkles className="w-7 h-7 text-accent" />
        </div>
        <p className="text-zinc-400 text-sm">Starts the clues this round</p>
        <p className="text-4xl font-bold text-accent mt-2">{starter?.name}</p>
        <p className="text-zinc-500 text-sm mt-6 max-w-xs">
          Go around the room. Each surviving player gives one short clue. No word repeats.
        </p>

        <div className="mt-10 w-full">
          <div className="flex items-center gap-2 justify-center text-zinc-500 text-xs uppercase tracking-wider mb-3">
            <Users className="w-3.5 h-3.5" />
            Surviving ({alive.length})
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {alive.map((p) => (
              <div
                key={p.id}
                className="px-3 py-1.5 rounded-full bg-bg-elevated border border-bg-border text-zinc-200 text-sm"
              >
                {p.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Button size="lg" className="w-full" onClick={openVote}>
        Everyone gave their clue — vote
      </Button>
    </div>
  );
}
