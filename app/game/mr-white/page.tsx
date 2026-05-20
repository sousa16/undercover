"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Crown, Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useGame } from "@/context/GameContext";

export default function MrWhitePage() {
  const router = useRouter();
  const { state, mrWhiteResolved } = useGame();

  React.useEffect(() => {
    if (state.phase === "idle") router.replace("/game/setup");
    else if (state.phase === "reveal") router.replace("/game/reveal");
    else if (state.phase === "round") router.replace("/game/round");
    else if (state.phase === "vote") router.replace("/game/vote");
    else if (state.phase === "ended") router.replace("/game/end");
  }, [state.phase, router]);

  if (state.phase !== "mr_white_guess") return null;

  const mrWhite = state.players.find((p) => p.id === state.pendingMrWhiteId);
  const civilianWord = state.pair?.word_civilian ?? "—";

  function resolve(correct: boolean) {
    mrWhiteResolved(correct);
    if (correct) router.replace("/game/end");
    // Otherwise: redirect handled by useEffect on phase change.
  }

  return (
    <div className="flex-1 flex flex-col py-6 animate-fade-in">
      <header className="mb-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-accent-muted/30 border border-accent/30 flex items-center justify-center mx-auto mb-4">
          <Crown className="w-6 h-6 text-accent" />
        </div>
        <h1 className="text-2xl font-semibold">Mr. White was caught</h1>
        <p className="text-zinc-500 text-sm mt-2 max-w-xs mx-auto">
          {mrWhite?.name} now gets one chance to guess the civilians&apos; word out loud.
        </p>
      </header>

      <div className="flex-1 flex flex-col justify-center">
        <div className="rounded-2xl bg-bg-surface border border-bg-border p-6 text-center">
          <div className="text-xs uppercase tracking-wider text-zinc-500 mb-2">
            Civilians&apos; word (for the host)
          </div>
          <div className="text-2xl font-bold text-zinc-100">{civilianWord}</div>
          <p className="text-zinc-500 text-xs mt-3">
            Keep the phone hidden until Mr. White has guessed.
          </p>
        </div>
      </div>

      <div className="space-y-3 mt-6">
        <Button size="lg" className="w-full" onClick={() => resolve(true)}>
          <Check className="w-4 h-4" />
          Guessed correctly — Mr. White wins
        </Button>
        <Button variant="secondary" size="lg" className="w-full" onClick={() => resolve(false)}>
          <X className="w-4 h-4" />
          Guessed wrong — game continues
        </Button>
      </div>
    </div>
  );
}
