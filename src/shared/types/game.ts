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
  cameraX?: number;
  cameraY?: number;
  setCameraPosition: (x: number, y: number) => void;
}

export interface GameSave {
  playerLevel: number;
  playerExperience: number;
  collectedItems: number;
  playerX: number;
  playerY: number;
  timestamp: number;
}

export interface GameSettings {
  volume: number;
}

export type GameObjects = PlatformsType | FoodsType;
