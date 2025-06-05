export enum EditorItem {
  ASTEROID = "asteroid",
}

export type EditorItemType = (typeof EditorItem)[keyof typeof EditorItem];

export interface EditorState {
  editorItem: EditorItem;
  setEditorItem: (item: EditorItem) => void;
}
