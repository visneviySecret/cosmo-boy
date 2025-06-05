export enum EditorItem {
  ASTEROID = "asteroid",
  PLATFORM = "platform",
}

export type EditorItemType = (typeof EditorItem)[keyof typeof EditorItem];

export interface EditorState {
  editorItem: EditorItem;
  setEditorItem: (item: EditorItem) => void;
}
