import { Level } from "../entities/Level";
import { Asteroid } from "../entities/Asteroid";
import { Platform, type PlatformConfig } from "../entities/Platform";
import type Phaser from "phaser";
import { LEVEL_STORAGE_KEY } from "./editorUtils";
import { EditorItem } from "../../../shared/types/editor";
import { PutinWebPlatform } from "../entities/PutinWebPlatform";
import type { PlatformsType } from "../../../shared/types/platforms";
import { createCollision } from "./collisionHandler";
import type { Player } from "../entities/Player";

export function loadCustomLevel(): Level | null {
  const json = localStorage.getItem(LEVEL_STORAGE_KEY);
  if (json) {
    return Level.fromJSON(json);
  }
  return null;
}

export function generatePlatformsFromLevel(
  scene: Phaser.Scene,
  player: Player,
  level: Level
): PlatformsType[] {
  return level.getPlatforms().map((cfg: PlatformConfig) => {
    const platform = getPlatformByType(scene, cfg);
    createCollision(scene, player, platform);
    return platform;
  });
}

export function getPlatformByType(
  scene: Phaser.Scene,
  cfg: PlatformConfig
): PlatformsType {
  switch (cfg.type) {
    case EditorItem.ASTEROID:
      return new Asteroid(scene, cfg);
    case EditorItem.PUTIN_WEB:
      return new PutinWebPlatform(scene, cfg);
    default:
      return new Platform(scene, cfg);
  }
}
