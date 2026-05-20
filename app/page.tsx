"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Play, Lightbulb, Shield, LogOut, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useGame } from "@/context/GameContext";
import { signOut } from "@/lib/auth";

export default function HomePage() {
  const router = useRouter();
  const { state, reset } = useGame();

  const hasGame = state.phase !== "idle" && state.phase !== "ended";

  function resumeRoute() {
    if (state.phase === "reveal") return "/game/reveal";
    if (state.phase === "round") return "/game/round";
    if (state.phase === "vote") return "/game/vote";
    if (state.phase === "mr_white_guess") return "/game/mr-white";
    if (state.phase === "ended") return "/game/end";
    return "/game/setup";
  }

  return (
    <div className="flex-1 flex flex-col py-8 animate-fade-in">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">Undercover</h1>
        <p className="text-zinc-500 mt-1 text-sm">Pass the phone. Find the impostors.</p>
      </header>

      <div className="space-y-3">
        {hasGame && (
          <button
            onClick={() => router.push(resumeRoute())}
            className="w-full text-left rounded-2xl bg-accent-muted/20 border border-accent/40 p-4 active:scale-[0.99] transition-transform"
          >
            <div className="text-xs uppercase tracking-wider text-accent">Resume</div>
            <div className="text-base mt-1 text-zinc-100">
              Round {Math.max(state.round, 1)} · {state.players.filter((p) => p.alive).length} alive
            </div>
          </button>
        )}

        <Button
          size="lg"
          className="w-full justify-between"
          onClick={() => {
            if (hasGame) reset();
            router.push("/game/setup");
          }}
        >
          <span className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            New game
          </span>
        </Button>

        <Link href="/suggest" className="block">
          <Button variant="secondary" size="lg" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Suggest a pair
            </span>
          </Button>
        </Link>

        <Link href="/admin" className="block">
          <Button variant="ghost" size="lg" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Admin
            </span>
          </Button>
        </Link>
      </div>

      <div className="mt-auto pt-12 flex items-center justify-between text-zinc-500 text-xs">
        <button
          onClick={() => {
            reset();
          }}
          className="flex items-center gap-1.5 hover:text-zinc-300 tap-target"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear game state
        </button>
        <button
          onClick={() => {
            signOut();
            router.replace("/login");
          }}
          className="flex items-center gap-1.5 hover:text-zinc-300 tap-target"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign out
        </button>
      </div>
    </div>
  );
}
