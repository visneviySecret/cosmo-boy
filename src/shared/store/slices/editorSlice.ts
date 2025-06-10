import type { StateCreator } from "zustand";
import { type EditorState, EditorItem } from "../../types/editor";
import type { Level } from "../../../features/game/entities/Level";

export const createEditorSlice: StateCreator<EditorState> = (set) => ({
  editorItem: EditorItem.ASTEROID,
  setEditorItem: (item: EditorItem | null) => set({ editorItem: item }),
  selectedLevel: null,
  setSelectedLevel: (level: Level | null) => set({ selectedLevel: level }),
});
