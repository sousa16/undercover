"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Skull, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useGame } from "@/context/GameContext";
import { roleLabel, type Player } from "@/lib/game-logic";

export default function VotePage() {
  const router = useRouter();
  const { state, eliminate } = useGame();
  const [selected, setSelected] = React.useState<string | null>(null);
  const [confirming, setConfirming] = React.useState(false);
  const [reveal, setReveal] = React.useState<Player | null>(null);

  React.useEffect(() => {
    if (state.phase === "idle") router.replace("/game/setup");
    else if (state.phase === "reveal") router.replace("/game/reveal");
    else if (state.phase === "round") router.replace("/game/round");
    else if (state.phase === "mr_white_guess") router.replace("/game/mr-white");
    else if (state.phase === "ended") router.replace("/game/end");
  }, [state.phase, router]);

  if (state.phase !== "vote") return null;

  const alive = state.players.filter((p) => p.alive);
  const target = alive.find((p) => p.id === selected) ?? null;

  function confirm() {
    if (!target) return;
    setReveal(target);
    setConfirming(false);
  }

  function continueAfterReveal() {
    if (!reveal) return;
    eliminate(reveal.id);
    setReveal(null);
    setSelected(null);
    // The reducer updates phase to round/ended/mr_white_guess; the
    // useEffect above forwards us to the right screen on rerender.
  }

  return (
    <div className="flex-1 flex flex-col py-6 animate-fade-in">
      <header className="mb-6 text-center">
        <p className="text-xs uppercase tracking-wider text-zinc-500">Round {state.round}</p>
        <h1 className="text-2xl font-semibold mt-1">Vote to eliminate</h1>
        <p className="text-zinc-500 text-sm mt-1">Tap the player the group agreed on.</p>
      </header>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {alive.map((p) => {
          const isSel = selected === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setSelected(p.id)}
              className={[
                "rounded-2xl p-5 border text-left active:scale-[0.98] transition-all tap-target",
                isSel
                  ? "bg-accent-muted/30 border-accent text-zinc-50 shadow-[0_0_0_3px_rgba(124,92,255,0.15)]"
                  : "bg-bg-surface border-bg-border text-zinc-200 hover:border-zinc-700",
              ].join(" ")}
            >
              <div className="text-xs uppercase tracking-wider text-zinc-500 mb-1">Player</div>
              <div className="font-semibold text-lg truncate">{p.name}</div>
            </button>
          );
        })}
      </div>

      <Button
        size="lg"
        variant="danger"
        className="w-full mt-auto"
        onClick={() => setConfirming(true)}
        disabled={!selected}
      >
        <Skull className="w-4 h-4" />
        Confirm elimination
      </Button>

      <Modal open={confirming} onClose={() => setConfirming(false)}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-danger/15 border border-danger/30 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-danger" />
          </div>
          <h2 className="text-lg font-semibold">Eliminate {target?.name}?</h2>
        </div>
        <p className="text-zinc-400 text-sm mb-5">
          The group is voting them out. Their identity will be revealed.
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" size="lg" className="flex-1" onClick={() => setConfirming(false)}>
            Cancel
          </Button>
          <Button variant="danger" size="lg" className="flex-1" onClick={confirm}>
            Eliminate
          </Button>
        </div>
      </Modal>

      <Modal open={!!reveal} onClose={() => {}}>
        {reveal && (
          <div className="text-center py-2">
            <div className="text-xs uppercase tracking-wider text-zinc-500 mb-2">Revealed</div>
            <div className="text-3xl font-bold text-zinc-50 mb-1">{reveal.name}</div>
            <div
              className={[
                "inline-block px-3 py-1 rounded-full text-sm font-medium mt-2",
                reveal.role === "civilian"
                  ? "bg-success/15 text-success border border-success/30"
                  : reveal.role === "undercover"
                  ? "bg-accent/15 text-accent border border-accent/30"
                  : "bg-zinc-500/15 text-zinc-200 border border-zinc-500/30",
              ].join(" ")}
            >
              {roleLabel(reveal.role)}
            </div>
            {reveal.word && (
              <div className="text-zinc-400 text-sm mt-4">
                Their word was{" "}
                <span className="text-zinc-100 font-medium">{reveal.word}</span>
              </div>
            )}
            <Button size="lg" className="w-full mt-6" onClick={continueAfterReveal}>
              Continue
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
