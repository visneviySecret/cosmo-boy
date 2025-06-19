import { showAd } from "../../../app/advertisment";
import { playVideo } from "../../../shared/utils/playVideo";
import type { Player } from "../entities/Player";

export const growthAnimation = (scene: Phaser.Scene, player: Player) => {
  const timeline = scene.add.timeline({});

  scene.input.enabled = false;

  timeline.add({
    tween: {
      targets: player,
      alpha: 0,
      duration: 100,
      yoyo: true,
      repeat: 5,
      ease: "Linear",
    },
  });

  timeline.on("complete", () => {
    player.alpha = 1;
    setTimeout(() => {
      scene.input.enabled = true;
      if (player.getLevel() === 4)
        playVideo(scene, "growth", () => {
          showAd();
        });
    }, 500);
  });

  timeline.play();
};

export const playShakeAnimation = (scene: Phaser.Scene, player: Player) => {
  const originalX = player.x;
  const originalY = player.y;

  scene.tweens.add({
    targets: player,
    x: originalX + 5,
    duration: 30,
    yoyo: true,
    repeat: 2,
    ease: "Power2",
    onComplete: () => {
      player.setPosition(originalX, originalY);
    },
  });

  scene.tweens.add({
    targets: player,
    y: originalY + 2,
    duration: 30,
    yoyo: true,
    repeat: 2,
    ease: "Power2",
  });
};
