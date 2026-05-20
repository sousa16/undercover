"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Lock, Shield, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { supabase, type WordPair } from "@/lib/supabase";
import { adminAuthenticate, adminSignOut, isAdminAuthed } from "@/lib/auth";

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
  const [deleting, setDeleting] = React.useState<string | null>(null);

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

  async function remove(id: string) {
    setDeleting(id);
    const { error } = await supabase.from("word_pairs").delete().eq("id", id);
    setDeleting(null);
    if (error) {
      setError(error.message);
      return;
    }
    setRows((r) => (r ? r.filter((x) => x.id !== id) : r));
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

      <div className="space-y-2">
        {rows?.map((row) => (
          <div
            key={row.id}
            className="flex items-center gap-3 rounded-xl bg-bg-surface border border-bg-border px-4 py-3"
          >
            <div className="flex-1 min-w-0">
              <div className="text-zinc-100 text-sm truncate">
                {row.word_civilian} <span className="text-zinc-600 mx-1">·</span>{" "}
                <span className="text-accent">{row.word_undercover}</span>
              </div>
              <div className="text-zinc-600 text-xs">
                {new Date(row.created_at).toLocaleDateString()}
              </div>
            </div>
            <button
              onClick={() => remove(row.id)}
              disabled={deleting === row.id}
              className="tap-target p-2 rounded-lg text-zinc-500 hover:text-danger hover:bg-danger/10 disabled:opacity-40"
              aria-label="Delete pair"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {rows && rows.length === 0 && (
          <div className="text-center text-zinc-600 text-sm py-12">
            No pairs yet. Add some via Suggest.
          </div>
        )}
      </div>
    </div>
  );
}
