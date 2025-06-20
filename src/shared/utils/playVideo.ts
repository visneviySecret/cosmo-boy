import { MusicManager } from "./MusicManager";

export function playVideo(
  scene: Phaser.Scene,
  videoName: string,
  onComplete?: () => void
) {
  scene.input.enabled = false;
  const camera = scene.cameras.main;

  let video = scene.add.video(0, 0, videoName);
  let screenWidth = camera.width < 1200 ? camera.width : 1200;
  let screenHeight = screenWidth;

  video.setDisplaySize(screenWidth, screenHeight);
  video.y = screenHeight;
  video.x = camera.scrollX + camera.width / 2;

  video.setMute(true);
  video.setDepth(1000);
  video.play();

  if (videoName === "cosmonaut-end") {
    scene.sound.stopAll();

    const musicManager = new MusicManager(scene);
    musicManager.initialize();
    musicManager.playCreditsMusic();
  }

  video.on("complete", () => {
    scene.input.enabled = true;
    video.destroy();
    onComplete?.();
  });
}
