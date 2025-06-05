import type { EditorState } from "./editor";
import type { GameState } from "./game";

export type StoreState = GameState & EditorState;
