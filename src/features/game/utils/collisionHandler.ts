import { Player } from "../entities/Player";
import { Asteroid } from "../entities/Asteroid";
import { PutinWebPlatform } from "../entities/PutinWebPlatform";
import Phaser from "phaser";
import type { PlatformsType } from "../../../shared/types/platforms";

export function handleCollision(player: Player) {
  player.setVelocity(0, 0);
  player.setIsOnPlatform(true);
}

export function handleWebCollision(player: Player, web: PutinWebPlatform) {
  if (player.isCurrentlyJumping()) {
    return;
  }

  player.setIsOnPlatform(false);
  player.setCurrentWeb(web);
  web.onPlayerCollision(player);
}

export function createCollision(
  scene: Phaser.Scene,
  player: Player,
  platform: PlatformsType
) {
  scene.physics.add.collider(
    player,
    platform,
    (obj1: unknown, obj2: unknown) => {
      const playerObj = obj1 as Player;
      const platformObj = obj2 as PlatformsType;

      if (platformObj instanceof Asteroid) {
        handleCollision(playerObj);
      } else if (platformObj instanceof PutinWebPlatform) {
        handleWebCollision(playerObj, platformObj);
      }
    },
    undefined,
    scene
  );
}
