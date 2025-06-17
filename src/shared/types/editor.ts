export enum EditorItem {
  // Platforms
  ASTEROID = "asteroid",
  PUTIN_WEB = "putin_web",

  // Collectables
  FOOD_1 = "food_1",
  FOOD_5 = "food_5",
  BROWNY = "browny",
}

export type EditorItemType = (typeof EditorItem)[keyof typeof EditorItem];

export interface EditorState {
  editorItem: EditorItem | null;
  setEditorItem: (item: EditorItem | null) => void;
}
