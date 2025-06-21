import Phaser from "phaser";

export class ParallaxBackground {
  private scene: Phaser.Scene;
  private backgrounds: Phaser.GameObjects.Image[] = [];
  private backgroundTexture: string = "bg_space";
  private finalBackground: Phaser.GameObjects.Image | null = null;
  private currentParallaxFactor: number = 0.1;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.createBackgrounds();
  }

  private createBackgrounds(): void {
    const camera = this.scene.cameras.main;
    const screenHeight = camera.height / 0.5;

    // Получаем размеры текстуры
    const texture = this.scene.textures.get(this.backgroundTexture);
    const imageWidth = texture.getSourceImage().width;
    const imageHeight = texture.getSourceImage().height;

    // Вычисляем масштаб для заполнения экрана по высоте без деформации
    const scaleY = screenHeight / imageHeight;
    const scaledWidth = imageWidth * scaleY;

    // Определяем количество изображений нужных для покрытия области игры
    const gameWidth = 50000; // Достаточно большая область для игры
    const imagesNeeded = Math.ceil(gameWidth / scaledWidth) + 1;
    const cameraXAfterLoad = this.scene.cameras.main.scrollX;
    const initialIndent = 2000;

    for (let i = 0; i < imagesNeeded; i++) {
      const xPosition =
        i * scaledWidth + scaledWidth / 2 + initialIndent + cameraXAfterLoad;

      const background = this.scene.add.image(
        xPosition,
        screenHeight / 2, // Центрируем по вертикали
        this.backgroundTexture
      );

      // Устанавливаем размер с сохранением пропорций
      background.setDisplaySize(scaledWidth, screenHeight);

      // Устанавливаем глубину фона (за всеми остальными объектами)
      background.setDepth(-100);

      // Устанавливаем начальный коэффициент параллакса
      background.setScrollFactor(this.currentParallaxFactor, 1);

      this.backgrounds.push(background);
    }
  }

  // Метод для показа финального фона
  public showFinalBackground(): void {
    if (this.finalBackground) return; // Уже показан

    const camera = this.scene.cameras.main;
    const screenHeight = camera.height / 0.5;

    // Получаем размеры финальной текстуры
    const texture = this.scene.textures.get("bg_final");
    const imageWidth = texture.getSourceImage().width;
    const imageHeight = texture.getSourceImage().height;

    // Вычисляем масштаб для заполнения экрана по высоте
    const scaleY = screenHeight / imageHeight;
    const scaledWidth = imageWidth * scaleY;

    // Позиционируем финальный фон справа от экрана
    const startX = camera.scrollX + camera.width + scaledWidth / 2;

    this.finalBackground = this.scene.add.image(
      startX,
      screenHeight / 2,
      "bg_final"
    );

    this.finalBackground.setDisplaySize(scaledWidth, screenHeight);
    this.finalBackground.setDepth(-99); // Чуть выше обычного фона
    this.finalBackground.setScrollFactor(this.currentParallaxFactor, 1);

    // Анимация появления слева
    this.scene.tweens.add({
      targets: this.finalBackground,
      x: camera.scrollX + camera.width / 2,
      duration: 3000,
      ease: "Power2",
    });
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

    if (this.finalBackground && this.finalBackground.scene) {
      this.finalBackground.destroy();
      this.finalBackground = null;
    }
  }
}
