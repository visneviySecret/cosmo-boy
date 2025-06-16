export function playVideo(
  scene: Phaser.Scene,
  videoName: string,
  onComplete: () => void
) {
  scene.input.enabled = false;
  let video = scene.add.video(0, 0, videoName).setOrigin(0, 0);
  let screenWidth =
    scene.cameras.main.width < 1200 ? scene.cameras.main.width : 1200;
  let screenHeight = screenWidth;

  video.setDisplaySize(screenWidth, screenHeight);
  video.y = video.height;
  video.x = screenWidth / 2;

  video.setMute(true);
  video.setDepth(1000);
  video.play();

  video.on("complete", () => {
    scene.input.enabled = true;
    onComplete();
  });
}
