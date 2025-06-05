import type { StateCreator } from "zustand";
import { GameMode, type GameState } from "../../types/game.ts";

export const createGameSlice: StateCreator<GameState> = (set) => ({
  mode: GameMode.PLAY,
  setMode: (mode: GameMode) => set({ mode }),
});
