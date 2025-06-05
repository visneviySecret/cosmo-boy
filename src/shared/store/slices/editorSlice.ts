import type { StateCreator } from "zustand";
import { type EditorState, EditorItem } from "../../types/editor";

export const createEditorSlice: StateCreator<EditorState> = (set) => ({
  editorItem: EditorItem.ASTEROID,
  setEditorItem: (item: EditorItem) => set({ editorItem: item }),
});
