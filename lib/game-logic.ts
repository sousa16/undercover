import { shuffle } from "./utils";

export type Role = "civilian" | "undercover" | "mr_white";

export type Player = {
  id: string;
  name: string;
  role: Role;
  word: string | null;
  hasSeenWord: boolean;
  alive: boolean;
};

export type RoleCounts = {
  undercovers: number;
  mrWhites: number;
  civilians: number;
};

export function defaultRoleCounts(playerCount: number): RoleCounts {
  if (playerCount < 3) {
    return { undercovers: 1, mrWhites: 0, civilians: Math.max(0, playerCount - 1) };
  }
  if (playerCount <= 4) {
    return { undercovers: 1, mrWhites: 0, civilians: playerCount - 1 };
  }
  if (playerCount <= 6) {
    return { undercovers: 1, mrWhites: 1, civilians: playerCount - 2 };
  }
  return { undercovers: 2, mrWhites: 1, civilians: playerCount - 3 };
}

export function validateRoleCounts(counts: RoleCounts, playerCount: number): string | null {
  const total = counts.undercovers + counts.mrWhites + counts.civilians;
  if (total !== playerCount) return "Role counts must equal the number of players.";
  if (counts.civilians < 1) return "Need at least one civilian.";
  if (counts.undercovers < 1) return "Need at least one undercover.";
  if (counts.undercovers + counts.mrWhites >= counts.civilians) {
    return "Civilians must outnumber undercovers + Mr. Whites at the start.";
  }
  return null;
}

export function buildPlayers(
  names: string[],
  counts: RoleCounts,
  pair: { word_civilian: string; word_undercover: string },
): Player[] {
  const roles: Role[] = [
    ...Array(counts.undercovers).fill("undercover"),
    ...Array(counts.mrWhites).fill("mr_white"),
    ...Array(counts.civilians).fill("civilian"),
  ];
  const shuffledRoles = shuffle(roles);
  return names.map((name, idx) => {
    const role = shuffledRoles[idx];
    const word =
      role === "civilian" ? pair.word_civilian : role === "undercover" ? pair.word_undercover : null;
    return {
      id: `p_${idx}_${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim(),
      role,
      word,
      hasSeenWord: false,
      alive: true,
    };
  });
}

export type Winner = "civilians" | "undercover" | "mr_white" | null;

export function evaluateWinner(players: Player[], mrWhiteGuessed?: boolean): Winner {
  if (mrWhiteGuessed) return "mr_white";
  const alive = players.filter((p) => p.alive);
  const aliveUndercovers = alive.filter((p) => p.role === "undercover").length;
  const aliveMrWhites = alive.filter((p) => p.role === "mr_white").length;
  const aliveCivilians = alive.filter((p) => p.role === "civilian").length;

  if (aliveUndercovers === 0 && aliveMrWhites === 0) return "civilians";
  if (aliveUndercovers + aliveMrWhites >= aliveCivilians) return "undercover";
  return null;
}

export function roleLabel(role: Role): string {
  if (role === "civilian") return "Civilian";
  if (role === "undercover") return "Undercover";
  return "Mr. White";
}
