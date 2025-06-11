import { GAME_LEVELS_STORAGE_KEY } from "../utils/editorUtils";
import type { PlatformConfig } from "./Platform";

export interface LevelData {
  id: string;
  name: string;
  platforms: PlatformConfig[];
}

export class Level {
  private id: string;
  private name: string;
  private platforms: PlatformConfig[];

  constructor(data?: LevelData) {
    this.id = data?.id || "";
    this.name = data?.name || "";
    this.platforms = data?.platforms || [];
  }

  addPlatform(config: PlatformConfig) {
    this.platforms.push(config);
    this.onSaveLevel();
  }

  removePlatform(index: number) {
    this.platforms.splice(index, 1);
    this.onSaveLevel();
  }

  getPlatforms(): PlatformConfig[] {
    return this.platforms;
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
      platforms: this.platforms,
    };
  }

  private onSaveLevel() {
    this.saveLevel({
      id: this.id,
      name: this.name,
      platforms: this.platforms,
    });
  }

  saveLevel(props: LevelData | null) {
    if (!props?.id) return;
    const currentLevel = {
      id: props.id,
      name: props.name,
      platforms: this.getPlatforms(),
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
  }

  static fromJSON(json: string): Level {
    return new Level(JSON.parse(json));
  }
}
