"use client";

import * as React from "react";
import {
  buildPlayers,
  evaluateWinner,
  type Player,
  type RoleCounts,
  type Winner,
} from "@/lib/game-logic";
import { randomFrom } from "@/lib/utils";

export type GamePhase =
  | "idle"
  | "reveal"
  | "round"
  | "vote"
  | "mr_white_guess"
  | "ended";

export type GameState = {
  phase: GamePhase;
  players: Player[];
  pair: { word_civilian: string; word_undercover: string } | null;
  revealIndex: number;
  round: number;
  startingPlayerId: string | null;
  pendingMrWhiteId: string | null;
  lastEliminatedId: string | null;
  winner: Winner;
};

const initialState: GameState = {
  phase: "idle",
  players: [],
  pair: null,
  revealIndex: 0,
  round: 0,
  startingPlayerId: null,
  pendingMrWhiteId: null,
  lastEliminatedId: null,
  winner: null,
};

type Action =
  | {
      type: "start";
      names: string[];
      counts: RoleCounts;
      pair: { word_civilian: string; word_undercover: string };
    }
  | { type: "advanceReveal" }
  | { type: "beginRound" }
  | { type: "openVote" }
  | { type: "eliminate"; playerId: string }
  | { type: "mrWhiteResolved"; guessedCorrectly: boolean }
  | { type: "reset" }
  | { type: "hydrate"; state: GameState };

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "hydrate":
      return action.state;

    case "start": {
      const players = buildPlayers(action.names, action.counts, action.pair);
      return {
        ...initialState,
        phase: "reveal",
        players,
        pair: action.pair,
        revealIndex: 0,
      };
    }

    case "advanceReveal": {
      const idx = state.revealIndex;
      const players = state.players.map((p, i) =>
        i === idx ? { ...p, hasSeenWord: true } : p,
      );
      const nextIdx = idx + 1;
      if (nextIdx >= players.length) {
        // All players saw their words → roll into rounds.
        const alive = players.filter((p) => p.alive);
        const starter = randomFrom(alive);
        return {
          ...state,
          players,
          phase: "round",
          round: 1,
          startingPlayerId: starter.id,
          revealIndex: nextIdx,
        };
      }
      return { ...state, players, revealIndex: nextIdx };
    }

    case "beginRound": {
      const alive = state.players.filter((p) => p.alive);
      const starter = randomFrom(alive);
      return {
        ...state,
        phase: "round",
        round: state.round + 1,
        startingPlayerId: starter.id,
      };
    }

    case "openVote":
      return { ...state, phase: "vote" };

    case "eliminate": {
      const players = state.players.map((p) =>
        p.id === action.playerId ? { ...p, alive: false } : p,
      );
      const eliminated = players.find((p) => p.id === action.playerId);

      if (eliminated?.role === "mr_white") {
        return {
          ...state,
          players,
          lastEliminatedId: action.playerId,
          pendingMrWhiteId: action.playerId,
          phase: "mr_white_guess",
        };
      }

      const winner = evaluateWinner(players);
      if (winner) {
        return {
          ...state,
          players,
          lastEliminatedId: action.playerId,
          phase: "ended",
          winner,
        };
      }
      // Start a new round automatically with a new random starter.
      const alive = players.filter((p) => p.alive);
      const starter = randomFrom(alive);
      return {
        ...state,
        players,
        lastEliminatedId: action.playerId,
        phase: "round",
        round: state.round + 1,
        startingPlayerId: starter.id,
      };
    }

    case "mrWhiteResolved": {
      if (action.guessedCorrectly) {
        return { ...state, phase: "ended", winner: "mr_white", pendingMrWhiteId: null };
      }
      const winner = evaluateWinner(state.players);
      if (winner) {
        return { ...state, phase: "ended", winner, pendingMrWhiteId: null };
      }
      const alive = state.players.filter((p) => p.alive);
      const starter = randomFrom(alive);
      return {
        ...state,
        pendingMrWhiteId: null,
        phase: "round",
        round: state.round + 1,
        startingPlayerId: starter.id,
      };
    }

    case "reset":
      return initialState;

    default:
      return state;
  }
}

const STORAGE_KEY = "uc_game_state_v1";

type GameContextValue = {
  state: GameState;
  startGame: (
    names: string[],
    counts: RoleCounts,
    pair: { word_civilian: string; word_undercover: string },
  ) => void;
  advanceReveal: () => void;
  beginRound: () => void;
  openVote: () => void;
  eliminate: (playerId: string) => void;
  mrWhiteResolved: (guessedCorrectly: boolean) => void;
  reset: () => void;
};

const GameContext = React.createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [hydrated, setHydrated] = React.useState(false);

  // Load persisted state once on mount.
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as GameState;
        if (parsed && typeof parsed === "object" && "phase" in parsed) {
          dispatch({ type: "hydrate", state: parsed });
        }
      }
    } catch {
      // ignore corrupt state
    }
    setHydrated(true);
  }, []);

  // Persist on every change after hydration.
  React.useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota errors
    }
  }, [state, hydrated]);

  const value = React.useMemo<GameContextValue>(
    () => ({
      state,
      startGame: (names, counts, pair) =>
        dispatch({ type: "start", names, counts, pair }),
      advanceReveal: () => dispatch({ type: "advanceReveal" }),
      beginRound: () => dispatch({ type: "beginRound" }),
      openVote: () => dispatch({ type: "openVote" }),
      eliminate: (playerId) => dispatch({ type: "eliminate", playerId }),
      mrWhiteResolved: (guessedCorrectly) =>
        dispatch({ type: "mrWhiteResolved", guessedCorrectly }),
      reset: () => dispatch({ type: "reset" }),
    }),
    [state],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = React.useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside <GameProvider>");
  return ctx;
}
