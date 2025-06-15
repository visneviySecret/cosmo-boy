import type { FoodsType } from "./food";
import type { PlatformsType } from "./platforms";

export enum GameMode {
  PLAY = "play",
  EDITOR = "editor",
}

export type GameModeType = (typeof GameMode)[keyof typeof GameMode];

export interface GameState {
  mode: GameMode;
  setMode: (mode: GameMode) => void;
}

export type GameObjects = PlatformsType | FoodsType;
