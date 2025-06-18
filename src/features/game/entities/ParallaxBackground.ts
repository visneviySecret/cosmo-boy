import Phaser from "phaser";

export class ParallaxBackground {
  private scene: Phaser.Scene;
  private backgrounds: Phaser.GameObjects.Image[] = [];
  private backgroundTextures: string[] = [
    "bg_level_1",
    "bg_level_2",
    "bg_level_3",
    "bg_level_4",
    "bg_level_5",
    "bg_level_6",
    "bg_level_7",
    "bg_level_8",
  ];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.createBackgrounds();
  }

  private createBackgrounds(): void {
    const camera = this.scene.cameras.main;
    const screenHeight = camera.height;
    const imageSize = screenHeight; // Ширина равна высоте

    // Создаем фоновые изображения
    this.backgroundTextures.forEach((texture, index) => {
      // Первое изображение имеет отступ справа в 250 пикселей
      // Остальные располагаются друг за другом
      let xPosition: number;
      if (index === 0) {
        xPosition = 250 + imageSize / 2; // Отступ + половина ширины для центрирования
      } else {
        xPosition = 250 + index * imageSize + imageSize / 2; // Каждое следующее изображение располагается рядом
      }

      const background = this.scene.add.image(
        xPosition,
        screenHeight / 2, // Центрируем по вертикали
        texture
      );

      // Растягиваем изображение по всей высоте экрана, ширина = высота
      background.setDisplaySize(imageSize, screenHeight);

      // Устанавливаем глубину фона (за всеми остальными объектами)
      background.setDepth(-100);

      // Очень медленный коэффициент параллакса
      const parallaxFactor = 0.1 + index * 0.01; // Очень медленное движение
      background.setScrollFactor(parallaxFactor, 1);

      this.backgrounds.push(background);
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
  }
}
