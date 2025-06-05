import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { createGameSlice } from "./slices/gameSlice";
import { createEditorSlice } from "./slices/editorSlice";
import type { StoreState } from "../types/game";

export const useStore = create<StoreState>()(
  devtools(
    (...args) => ({
      ...createGameSlice(...args),
      ...createEditorSlice(...args),
    }),
    { name: "GameStore" }
  )
);
