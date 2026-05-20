export type Pack = {
  id: string;
  label: string;
};

export const PACKS: Pack[] = [
  { id: "geral", label: "Geral" },
  { id: "futebol", label: "Futebol" },
];

export const PACK_IDS = PACKS.map((p) => p.id);
export const DEFAULT_PACK_ID = "geral";

export function packLabel(id: string): string {
  return PACKS.find((p) => p.id === id)?.label ?? id;
}
