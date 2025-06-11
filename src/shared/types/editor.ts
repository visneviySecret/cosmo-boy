export enum EditorItem {
  ASTEROID = "asteroid",
  PUTIN_WEB = "putin_web",
}

export type EditorItemType = (typeof EditorItem)[keyof typeof EditorItem];

export interface EditorState {
  editorItem: EditorItem | null;
  setEditorItem: (item: EditorItem | null) => void;
}
