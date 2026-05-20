"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useGame } from "@/context/GameContext";
import { roleLabel } from "@/lib/game-logic";

export default function RevealPage() {
  const router = useRouter();
  const { state, advanceReveal } = useGame();
  const [shown, setShown] = React.useState(false);

  // Guard: this page only makes sense in the reveal phase.
  React.useEffect(() => {
    if (state.phase === "idle") router.replace("/game/setup");
    else if (state.phase === "round") router.replace("/game/round");
    else if (state.phase === "vote") router.replace("/game/vote");
    else if (state.phase === "mr_white_guess") router.replace("/game/mr-white");
    else if (state.phase === "ended") router.replace("/game/end");
  }, [state.phase, router]);

  if (state.phase !== "reveal") return null;

  const player = state.players[state.revealIndex];
  if (!player) return null;

  const isLast = state.revealIndex === state.players.length - 1;

  function confirm() {
    setShown(false);
    advanceReveal();
    if (isLast) router.replace("/game/round");
  }

  return (
    <div className="flex-1 flex flex-col py-6 animate-fade-in">
      <header className="mb-6 text-center">
        <p className="text-xs uppercase tracking-wider text-zinc-500">
          Player {state.revealIndex + 1} of {state.players.length}
        </p>
        <h1 className="text-2xl font-semibold mt-1">Pass the phone to</h1>
        <p className="text-3xl font-bold text-accent mt-2">{player.name}</p>
      </header>

      <div className="flex-1 flex items-center justify-center">
        {!shown ? (
          <button
            onClick={() => setShown(true)}
            className="w-full aspect-[3/4] max-h-[420px] rounded-3xl bg-gradient-to-br from-bg-elevated to-bg-surface border border-bg-border flex flex-col items-center justify-center gap-4 active:scale-[0.99] transition-transform shadow-2xl"
          >
            <div className="w-16 h-16 rounded-2xl bg-accent-muted/30 border border-accent/30 flex items-center justify-center">
              <EyeOff className="w-7 h-7 text-accent" />
            </div>
            <div className="text-center px-6">
              <div className="text-zinc-200 font-semibold text-lg">Tap to reveal</div>
              <div className="text-zinc-500 text-sm mt-1">
                Make sure nobody else can see the screen.
              </div>
            </div>
          </button>
        ) : (
          <div className="w-full aspect-[3/4] max-h-[420px] rounded-3xl bg-gradient-to-br from-accent-muted/30 to-bg-surface border border-accent/40 flex flex-col items-center justify-center p-6 animate-scale-in shadow-2xl">
            <div className="text-xs uppercase tracking-wider text-zinc-400 mb-3">
              Your role
            </div>
            {player.role === "mr_white" ? (
              <>
                <div className="text-4xl font-bold text-accent">Mr. White</div>
                <p className="text-zinc-400 text-sm mt-4 text-center px-4">
                  You don&apos;t have a word. Bluff your way through.
                </p>
              </>
            ) : (
              <>
                <div className="text-zinc-500 text-sm mb-2">{roleLabel(player.role)}</div>
                <div className="text-4xl font-bold text-zinc-50 text-center break-words">
                  {player.word}
                </div>
              </>
            )}
            <Eye className="w-5 h-5 text-zinc-600 mt-8" />
          </div>
        )}
      </div>

      <Button
        size="lg"
        className="w-full mt-6"
        onClick={confirm}
        disabled={!shown}
        variant={shown ? "primary" : "secondary"}
      >
        {isLast ? "Start the game" : "I have seen my word"}
      </Button>
    </div>
  );
}
