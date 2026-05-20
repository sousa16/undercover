"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Lock,
  Shield,
  Trash2,
  Pencil,
  Check,
  X as XIcon,
  Undo2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { supabase, type WordPair } from "@/lib/supabase";
import { adminAuthenticate, adminSignOut, isAdminAuthed } from "@/lib/auth";
import { PACKS, packLabel, DEFAULT_PACK_ID } from "@/lib/packs";

const UNDO_TIMEOUT_MS = 6000;

export default function AdminPage() {
  const [authed, setAuthed] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isAdminAuthed()) setAuthed(true);
  }, []);

  if (!authed) {
    return (
      <div className="flex-1 flex flex-col py-6 animate-fade-in">
        <header className="flex items-center gap-3 mb-8">
          <Link href="/" className="tap-target -ml-2 p-2 text-zinc-400 hover:text-zinc-100">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-semibold">Admin</h1>
        </header>
        <div className="flex-1 flex flex-col justify-center">
          <div className="w-14 h-14 rounded-2xl bg-bg-elevated border border-bg-border flex items-center justify-center mb-6 mx-auto">
            <Lock className="w-6 h-6 text-zinc-400" />
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (adminAuthenticate(password)) {
                setAuthed(true);
              } else {
                setError("Wrong admin password.");
              }
            }}
            className="space-y-3"
          >
            <Input
              type="password"
              autoFocus
              placeholder="Admin password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
            />
            {error && <p className="text-danger text-sm pl-1">{error}</p>}
            <Button type="submit" size="lg" className="w-full">
              Unlock admin
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return <AdminInner onSignOut={() => setAuthed(false)} />;
}

function AdminInner({ onSignOut }: { onSignOut: () => void }) {
  const [rows, setRows] = React.useState<WordPair[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [busyId, setBusyId] = React.useState<string | null>(null);

  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editCiv, setEditCiv] = React.useState("");
  const [editUnd, setEditUnd] = React.useState("");
  const [editPack, setEditPack] = React.useState<string>(DEFAULT_PACK_ID);
  const [editError, setEditError] = React.useState<string | null>(null);

  const [recentlyDeleted, setRecentlyDeleted] = React.useState<WordPair | null>(null);
  const undoTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = React.useCallback(async () => {
    setError(null);
    const { data, error } = await supabase
      .from("word_pairs")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    setRows(data ?? []);
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  React.useEffect(() => {
    return () => {
      if (undoTimer.current) clearTimeout(undoTimer.current);
    };
  }, []);

  function startEdit(row: WordPair) {
    setEditingId(row.id);
    setEditCiv(row.word_civilian);
    setEditUnd(row.word_undercover);
    setEditPack(row.pack ?? DEFAULT_PACK_ID);
    setEditError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditCiv("");
    setEditUnd("");
    setEditPack(DEFAULT_PACK_ID);
    setEditError(null);
  }

  async function saveEdit(id: string) {
    const civ = editCiv.trim();
    const und = editUnd.trim();
    if (!civ || !und) {
      setEditError("Both words required.");
      return;
    }
    if (civ.toLowerCase() === und.toLowerCase()) {
      setEditError("The two words must differ.");
      return;
    }
    setBusyId(id);
    const { error } = await supabase
      .from("word_pairs")
      .update({ word_civilian: civ, word_undercover: und, pack: editPack })
      .eq("id", id);
    setBusyId(null);
    if (error) {
      setEditError(error.message);
      return;
    }
    setRows((r) =>
      r
        ? r.map((x) =>
            x.id === id
              ? { ...x, word_civilian: civ, word_undercover: und, pack: editPack }
              : x,
          )
        : r,
    );
    cancelEdit();
  }

  async function remove(row: WordPair) {
    setBusyId(row.id);
    const { error } = await supabase.from("word_pairs").delete().eq("id", row.id);
    setBusyId(null);
    if (error) {
      setError(error.message);
      return;
    }
    setRows((r) => (r ? r.filter((x) => x.id !== row.id) : r));
    setRecentlyDeleted(row);
    if (undoTimer.current) clearTimeout(undoTimer.current);
    undoTimer.current = setTimeout(() => setRecentlyDeleted(null), UNDO_TIMEOUT_MS);
  }

  async function undo() {
    if (!recentlyDeleted) return;
    const row = recentlyDeleted;
    setRecentlyDeleted(null);
    if (undoTimer.current) {
      clearTimeout(undoTimer.current);
      undoTimer.current = null;
    }
    const { error } = await supabase.from("word_pairs").insert({
      id: row.id,
      word_civilian: row.word_civilian,
      word_undercover: row.word_undercover,
      pack: row.pack,
      created_at: row.created_at,
    });
    if (error) {
      setError(`Undo failed: ${error.message}`);
      return;
    }
    setRows((r) => {
      if (!r) return r;
      return [...r, row].sort((a, b) => b.created_at.localeCompare(a.created_at));
    });
  }

  return (
    <div className="flex-1 flex flex-col py-6 animate-fade-in">
      <header className="flex items-center gap-3 mb-6">
        <Link href="/" className="tap-target -ml-2 p-2 text-zinc-400 hover:text-zinc-100">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <Shield className="w-4 h-4 text-accent" /> Admin
        </h1>
        <button
          onClick={() => {
            adminSignOut();
            onSignOut();
          }}
          className="ml-auto text-xs text-zinc-500 hover:text-zinc-200 tap-target px-2"
        >
          Lock
        </button>
      </header>

      <p className="text-zinc-500 text-sm mb-4">
        {rows ? `${rows.length} pair${rows.length === 1 ? "" : "s"} in pool` : "Loading…"}
      </p>

      {error && (
        <div className="rounded-xl bg-danger/10 border border-danger/30 px-3 py-2 text-danger text-sm mb-3">
          {error}
        </div>
      )}

      <div className="space-y-2 pb-24">
        {rows?.map((row) =>
          editingId === row.id ? (
            <div
              key={row.id}
              className="rounded-xl bg-bg-surface border border-accent/40 px-3 py-3 space-y-2"
            >
              <Input
                value={editCiv}
                onChange={(e) => {
                  setEditCiv(e.target.value);
                  setEditError(null);
                }}
                placeholder="Civilian word"
                className="h-10"
              />
              <Input
                value={editUnd}
                onChange={(e) => {
                  setEditUnd(e.target.value);
                  setEditError(null);
                }}
                placeholder="Undercover word"
                className="h-10"
              />
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {PACKS.map((p) => {
                  const on = editPack === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setEditPack(p.id)}
                      className={[
                        "px-2.5 py-1 rounded-full text-xs tap-target transition-colors",
                        on
                          ? "bg-accent-muted/30 border border-accent text-zinc-50"
                          : "bg-bg-elevated border border-bg-border text-zinc-400 hover:text-zinc-200",
                      ].join(" ")}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
              {editError && <p className="text-danger text-xs pl-1">{editError}</p>}
              <div className="flex gap-2 pt-1">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={cancelEdit}
                  disabled={busyId === row.id}
                >
                  <XIcon className="w-3.5 h-3.5" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => saveEdit(row.id)}
                  disabled={busyId === row.id}
                >
                  <Check className="w-3.5 h-3.5" />
                  {busyId === row.id ? "Saving…" : "Save"}
                </Button>
              </div>
            </div>
          ) : (
            <div
              key={row.id}
              className="flex items-center gap-1 rounded-xl bg-bg-surface border border-bg-border px-4 py-3"
            >
              <div className="flex-1 min-w-0">
                <div className="text-zinc-100 text-sm truncate">
                  {row.word_civilian} <span className="text-zinc-600 mx-1">·</span>{" "}
                  <span className="text-accent">{row.word_undercover}</span>
                </div>
                <div className="text-zinc-600 text-xs flex items-center gap-2">
                  <span className="uppercase tracking-wider text-[10px] text-zinc-500">
                    {packLabel(row.pack ?? DEFAULT_PACK_ID)}
                  </span>
                  <span className="text-zinc-700">·</span>
                  <span>{new Date(row.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <button
                onClick={() => startEdit(row)}
                disabled={busyId === row.id}
                className="tap-target p-2 rounded-lg text-zinc-500 hover:text-accent hover:bg-accent/10 disabled:opacity-40"
                aria-label="Edit pair"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => remove(row)}
                disabled={busyId === row.id}
                className="tap-target p-2 rounded-lg text-zinc-500 hover:text-danger hover:bg-danger/10 disabled:opacity-40"
                aria-label="Delete pair"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ),
        )}
        {rows && rows.length === 0 && (
          <div className="text-center text-zinc-600 text-sm py-12">
            No pairs yet. Add some via Suggest.
          </div>
        )}
      </div>

      {recentlyDeleted && (
        <div className="fixed inset-x-0 bottom-0 px-4 pb-4 safe-bottom z-40 pointer-events-none">
          <div className="mx-auto max-w-md flex items-center gap-3 rounded-2xl bg-bg-elevated border border-bg-border shadow-2xl px-4 py-3 animate-scale-in pointer-events-auto">
            <div className="flex-1 min-w-0 text-sm">
              <div className="text-zinc-200 truncate">Deleted</div>
              <div className="text-zinc-500 text-xs truncate">
                {recentlyDeleted.word_civilian} · {recentlyDeleted.word_undercover}
              </div>
            </div>
            <Button size="sm" variant="secondary" onClick={undo}>
              <Undo2 className="w-3.5 h-3.5" />
              Undo
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
