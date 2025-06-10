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
    this.saveLevel({
      id: this.id,
      name: this.name,
      platforms: this.platforms,
    });
  }

  removePlatform(index: number) {
    this.platforms.splice(index, 1);
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

  saveLevel({ id, name }: LevelData) {
    if (!id) return;
    const currentLevel = {
      id,
      name,
      platforms: this.getPlatforms(),
    };
    let levels = JSON.parse(localStorage.getItem("gameLevels") || "[]");
    const levelIndex = levels.findIndex((level: LevelData) => level.id === id);
    levels[levelIndex] = currentLevel;
    localStorage.setItem("gameLevels", JSON.stringify(levels));
  }

  static fromJSON(json: string): Level {
    return new Level(JSON.parse(json));
  }
}
