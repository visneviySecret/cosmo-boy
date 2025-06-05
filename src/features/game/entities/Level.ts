import type { PlatformConfig } from "./Platform";

export interface LevelData {
  platforms: PlatformConfig[];
}

export class Level {
  private data: LevelData;

  constructor(data?: LevelData) {
    this.data = data || { platforms: [] };
  }

  addPlatform(config: PlatformConfig) {
    this.data.platforms.push(config);
  }

  removePlatform(index: number) {
    this.data.platforms.splice(index, 1);
  }

  getPlatforms(): PlatformConfig[] {
    return this.data.platforms;
  }

  toJSON(): string {
    return JSON.stringify(this.data);
  }

  static fromJSON(json: string): Level {
    return new Level(JSON.parse(json));
  }
}
