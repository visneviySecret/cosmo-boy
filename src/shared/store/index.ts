import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { createGameSlice } from "./slices/gameSlice";
import type { GameState } from "../types/game";

export const useStore = create<GameState>()(
  devtools(
    (...args) => ({
      ...createGameSlice(...args),
    }),
    { name: "GameStore" }
  )
);
