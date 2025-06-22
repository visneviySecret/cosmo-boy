import Phaser from "phaser";

export class ParallaxBackground {
  private scene: Phaser.Scene;
  private backgrounds: Phaser.GameObjects.Image[] = [];
  private backgroundTexture: string = "bg_space";
  private finalBackground: Phaser.GameObjects.Image | null = null;
  private currentParallaxFactor: number = 0.08;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.createBackgrounds();
  }

  private createBackgrounds(): void {
    const camera = this.scene.cameras.main;
    const zoom = camera.zoom;
    const screenHeight = camera.height / zoom;

    // Получаем размеры текстуры
    const texture = this.scene.textures.get(this.backgroundTexture);
    const imageWidth = texture.getSourceImage().width;
    const imageHeight = texture.getSourceImage().height;

    // Вычисляем масштаб для заполнения экрана по высоте без деформации
    const scaleY = screenHeight / imageHeight;
    const scaledWidth = imageWidth * scaleY;

    // Создаем только один фон без повторений
    const cameraXAfterLoad = this.scene.cameras.main.scrollX;
    const xPosition = cameraXAfterLoad + scaledWidth / 2;

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

  public updateBackgroundScale(): void {
    const camera = this.scene.cameras.main;
    const zoom = camera.zoom;
    const screenHeight = camera.height / zoom;

    // Получаем размеры текстуры
    const texture = this.scene.textures.get(this.backgroundTexture);
    const imageWidth = texture.getSourceImage().width;
    const imageHeight = texture.getSourceImage().height;

    // Вычисляем масштаб для заполнения экрана по высоте без деформации
    const scaleY = screenHeight / imageHeight;
    const scaledWidth = imageWidth * scaleY;

    // Пересчитываем позицию X с учетом текущей позиции камеры
    const cameraX = this.scene.cameras.main.scrollX;
    const xPosition = cameraX + scaledWidth / 2;

    // Обновляем размеры и позицию всех фоновых изображений
    this.backgrounds.forEach((background) => {
      if (background && background.scene) {
        background.setDisplaySize(scaledWidth, screenHeight);
        background.x = xPosition; // Обновляем позицию по X
        background.y = screenHeight / 2; // Обновляем позицию по Y
      }
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
