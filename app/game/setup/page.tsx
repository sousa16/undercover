"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, X, Minus, Users, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { useGame } from "@/context/GameContext";
import {
  defaultRoleCounts,
  validateRoleCounts,
  type RoleCounts,
} from "@/lib/game-logic";
import { supabase } from "@/lib/supabase";
import { randomFrom } from "@/lib/utils";
import {
  type PlayerGroup,
  listGroups,
  saveGroup,
  deleteGroup,
} from "@/lib/groups";

export default function SetupPage() {
  const router = useRouter();
  const { startGame } = useGame();
  const [names, setNames] = React.useState<string[]>(["", "", ""]);
  const [counts, setCounts] = React.useState<RoleCounts>(defaultRoleCounts(3));
  const [customized, setCustomized] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [groups, setGroups] = React.useState<PlayerGroup[]>([]);
  const [saveOpen, setSaveOpen] = React.useState(false);
  const [groupName, setGroupName] = React.useState("");
  const [saveError, setSaveError] = React.useState<string | null>(null);

  const validNames = names.map((n) => n.trim()).filter(Boolean);
  const playerCount = validNames.length;

  React.useEffect(() => {
    setGroups(listGroups());
  }, []);

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

  function loadGroup(g: PlayerGroup) {
    setNames(g.players.length >= 3 ? [...g.players] : [...g.players, "", "", ""].slice(0, 3));
    setError(null);
  }

  function removeGroup(id: string) {
    deleteGroup(id);
    setGroups(listGroups());
  }

  function openSave() {
    if (validNames.length < 3) {
      setError("Adiciona pelo menos 3 jogadores antes de guardar.");
      return;
    }
    setSaveError(null);
    setGroupName("");
    setSaveOpen(true);
  }

  function confirmSave() {
    try {
      saveGroup(groupName, validNames);
      setGroups(listGroups());
      setSaveOpen(false);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Não foi possível guardar.");
    }
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

      {groups.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs uppercase tracking-wider text-zinc-500 ml-1 mb-2 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            Groups
          </h2>
          <div className="flex flex-wrap gap-2">
            {groups.map((g) => (
              <div
                key={g.id}
                className="group inline-flex items-center rounded-full bg-bg-elevated border border-bg-border overflow-hidden"
              >
                <button
                  onClick={() => loadGroup(g)}
                  className="pl-3 pr-2 py-1.5 text-sm text-zinc-200 hover:text-accent tap-target"
                >
                  {g.name}
                  <span className="text-zinc-500 ml-1.5 text-xs">{g.players.length}</span>
                </button>
                <button
                  onClick={() => removeGroup(g.id)}
                  className="pr-2.5 pl-1 py-1.5 text-zinc-500 hover:text-danger tap-target"
                  aria-label={`Delete group ${g.name}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-2 mb-4">
        <div className="flex items-center justify-between mb-2 ml-1">
          <h2 className="text-xs uppercase tracking-wider text-zinc-500">
            Players ({playerCount})
          </h2>
          <button
            onClick={openSave}
            disabled={validNames.length < 3}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-accent disabled:opacity-40 tap-target px-2 -mr-2"
          >
            <Bookmark className="w-3.5 h-3.5" />
            Save group
          </button>
        </div>
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

      <Modal open={saveOpen} onClose={() => setSaveOpen(false)}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-accent-muted/30 border border-accent/30 flex items-center justify-center">
            <Bookmark className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Save group</h2>
            <p className="text-zinc-500 text-xs">
              {validNames.length} players: {validNames.join(", ")}
            </p>
          </div>
        </div>
        <Input
          autoFocus
          placeholder="Group name (e.g. Os Manos)"
          value={groupName}
          onChange={(e) => {
            setGroupName(e.target.value);
            setSaveError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") confirmSave();
          }}
        />
        {saveError && <p className="text-danger text-sm pl-1 mt-2">{saveError}</p>}
        <div className="flex gap-2 mt-4">
          <Button variant="secondary" size="lg" className="flex-1" onClick={() => setSaveOpen(false)}>
            Cancel
          </Button>
          <Button size="lg" className="flex-1" onClick={confirmSave} disabled={!groupName.trim()}>
            Save
          </Button>
        </div>
      </Modal>
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
