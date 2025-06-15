import {
  GAME_LEVELS_STORAGE_KEY,
  LEVEL_STORAGE_KEY,
} from "../utils/editorUtils";
import type { PlatformConfig } from "./Platform";
import type { FoodConfig } from "./Food";
import type { GameObjects } from "../../../shared/types/game";

export type GameObjectConfig = PlatformConfig | FoodConfig;

export interface LevelData {
  id: string;
  name: string;
  gameObjects: GameObjectConfig[];
}

export class Level {
  private id: string;
  private name: string;
  private gameObjects: GameObjectConfig[];

  constructor(data?: LevelData) {
    this.id = data?.id || "";
    this.name = data?.name || "";
    this.gameObjects = data?.gameObjects || [];
  }

  addGameObject(config: GameObjectConfig) {
    this.gameObjects.push(config);
    this.onSaveLevel();
  }

  removeGameObject(gameObject: GameObjects) {
    const index = this.gameObjects.findIndex(
      (obj) =>
        obj.x === gameObject.x &&
        obj.y === gameObject.y &&
        obj.size === gameObject.getSize()
    );

    if (index !== -1) {
      gameObject.destroy();
      this.gameObjects.splice(index, 1);
      this.onSaveLevel();
    }
  }

  getGameObjects(): GameObjectConfig[] {
    return this.gameObjects;
  }

  getLevelId(): string {
    return this.id;
  }

  getLevelName(): string {
    return this.name;
  }

  toJSON(): LevelData {
    return {
      id: this.id,
      name: this.name,
      gameObjects: this.gameObjects,
    };
  }

  private onSaveLevel() {
    this.saveLevel({
      id: this.id,
      name: this.name,
      gameObjects: this.gameObjects,
    });
  }

  saveLevel(props: LevelData | null) {
    if (!props?.id) return;
    const currentLevel = {
      id: props.id,
      name: props.name,
      gameObjects: props.gameObjects,
    };
    let levels = JSON.parse(
      localStorage.getItem(GAME_LEVELS_STORAGE_KEY) || "[]"
    );
    const levelIndex = levels.findIndex(
      (level: LevelData) => level.id === props.id
    );
    if (levelIndex !== -1) {
      levels[levelIndex] = currentLevel;
    } else {
      levels.push(currentLevel);
    }
    const updatedLevels = JSON.stringify(levels);
    localStorage.setItem(GAME_LEVELS_STORAGE_KEY, updatedLevels);
    localStorage.setItem(LEVEL_STORAGE_KEY, JSON.stringify(currentLevel));
  }

  static fromJSON(json: string): Level {
    const data = JSON.parse(json);
    return new Level(data);
  }
}
