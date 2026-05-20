export type PlayerGroup = {
  id: string;
  name: string;
  players: string[];
  createdAt: number;
};

const KEY = "uc_groups_v1";

export function listGroups(): PlayerGroup[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveGroup(name: string, players: string[]): PlayerGroup {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("O grupo precisa de um nome.");
  const validPlayers = players.map((p) => p.trim()).filter(Boolean);
  if (validPlayers.length < 3) throw new Error("Precisa de pelo menos 3 jogadores.");
  const group: PlayerGroup = {
    id: `g_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: trimmed,
    players: validPlayers,
    createdAt: Date.now(),
  };
  const groups = [...listGroups(), group];
  window.localStorage.setItem(KEY, JSON.stringify(groups));
  return group;
}

export function deleteGroup(id: string): void {
  const groups = listGroups().filter((g) => g.id !== id);
  window.localStorage.setItem(KEY, JSON.stringify(groups));
}
