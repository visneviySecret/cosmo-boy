import { create } from "zustand";
import { createGameSlice } from "./slices/gameSlice";
import type { GameState } from "../types/game.ts";

export const useStore = create<GameState>()((...args) => ({
  ...createGameSlice(...args),
}));
