import { Level } from "../entities/Level";
import { Asteroid } from "../entities/Asteroid";
import type { PlatformConfig } from "../entities/Platform";
import type Phaser from "phaser";

const LEVEL_STORAGE_KEY = "custom_level";

export function loadCustomLevel(): Level | null {
  const json = localStorage.getItem(LEVEL_STORAGE_KEY);
  if (json) {
    return Level.fromJSON(json);
  }
  return null;
}

export function generateAsteroidsFromLevel(
  scene: Phaser.Scene,
  level: Level
): Asteroid[] {
  return level
    .getPlatforms()
    .map((cfg: PlatformConfig) => new Asteroid(scene, cfg));
}
