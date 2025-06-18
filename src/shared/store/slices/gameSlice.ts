import type { StateCreator } from "zustand";
import { GameMode, type GameState } from "../../types/game";

export const createGameSlice: StateCreator<GameState> = (set) => {
  const prevMode = localStorage.getItem("mode") as GameMode;

  const initialMode = prevMode
    ? prevMode
    : process.env.NODE_ENV === "development"
    ? GameMode.EDITOR
    : GameMode.PLAY;

  return {
    mode: initialMode,
    setMode: (mode: GameMode) => {
      set({ mode });
      localStorage.setItem("mode", mode);
    },
    cameraX: undefined,
    cameraY: undefined,
    setCameraPosition: (x: number, y: number) => {
      set({ cameraX: x, cameraY: y });
    },
  };
};
