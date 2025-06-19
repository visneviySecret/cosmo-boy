import Phaser from "phaser";

export class ParallaxBackground {
  private scene: Phaser.Scene;
  private backgrounds: Phaser.GameObjects.Image[] = [];
  private backgroundTexture: string = "bg_space";

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.createBackgrounds();
  }

  private createBackgrounds(): void {
    const camera = this.scene.cameras.main;
    const screenHeight = camera.height;

    // Получаем размеры текстуры
    const texture = this.scene.textures.get(this.backgroundTexture);
    const imageWidth = texture.getSourceImage().width || 12057;
    const imageHeight = texture.getSourceImage().height || 12057;

    // Вычисляем масштаб для заполнения экрана по высоте без деформации
    const scaleY = screenHeight / imageHeight;
    const scaledWidth = imageWidth * scaleY;

    // Определяем количество изображений нужных для покрытия области игры
    const gameWidth = 50000; // Достаточно большая область для игры
    const imagesNeeded = Math.ceil(gameWidth / scaledWidth) + 1;

    for (let i = 0; i < imagesNeeded; i++) {
      const xPosition = i * scaledWidth + scaledWidth / 2;

      const background = this.scene.add.image(
        xPosition,
        screenHeight / 2, // Центрируем по вертикали
        this.backgroundTexture
      );

      // Устанавливаем размер с сохранением пропорций
      background.setDisplaySize(scaledWidth, screenHeight);

      // Устанавливаем глубину фона (за всеми остальными объектами)
      background.setDepth(-100);

      // Очень медленный коэффициент параллакса
      const parallaxFactor = 0.4;
      background.setScrollFactor(parallaxFactor, 1);

      this.backgrounds.push(background);
    }
  }

  public update(): void {
    // Для обычных изображений дополнительное обновление не требуется
    // Параллакс работает автоматически через setScrollFactor
  }

  public destroy(): void {
    this.backgrounds.forEach((background) => {
      if (background && background.scene) {
        background.destroy();
      }
    });
    this.backgrounds = [];
  }
}
