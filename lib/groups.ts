import { supabase } from "@/lib/supabase";

export type PlayerGroup = {
  id: string;
  name: string;
  players: string[];
  createdAt: string;
};

type Row = {
  id: string;
  name: string;
  players: unknown;
  created_at: string;
};

function fromRow(row: Row): PlayerGroup {
  return {
    id: row.id,
    name: row.name,
    players: Array.isArray(row.players)
      ? (row.players.filter((p) => typeof p === "string") as string[])
      : [],
    createdAt: row.created_at,
  };
}

export async function listGroups(): Promise<PlayerGroup[]> {
  const { data, error } = await supabase
    .from("player_groups")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as Row[] | null ?? []).map(fromRow);
}

export async function saveGroup(name: string, players: string[]): Promise<PlayerGroup> {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("O grupo precisa de um nome.");
  const validPlayers = players.map((p) => p.trim()).filter(Boolean);
  if (validPlayers.length < 3) throw new Error("Precisa de pelo menos 3 jogadores.");
  const { data, error } = await supabase
    .from("player_groups")
    .insert({ name: trimmed, players: validPlayers })
    .select()
    .single();
  if (error) throw error;
  return fromRow(data as Row);
}

export async function deleteGroup(id: string): Promise<void> {
  const { error } = await supabase.from("player_groups").delete().eq("id", id);
  if (error) throw error;
}
