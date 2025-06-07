import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import { Level } from "../entities/Level";
import { Platform } from "../entities/Platform";
import { Asteroid } from "../entities/Asteroid";
import type { PlatformConfig } from "../entities/Platform";
import { EditorContainer, EditorCanvas } from "./LevelEditor.styled";
import { LevelEditorTools } from "./LevelEditorTools";
import { useStore } from "../../../shared/store";
import { EditorItem } from "../../../shared/types/editor";
import { Player } from "../entities/Player";

const LEVEL_STORAGE_KEY = "custom_level";

type PlatformConfigWithType = PlatformConfig & { type?: string };

const LevelEditor: React.FC = () => {
  const phaserRef = useRef<HTMLDivElement>(null);
  const levelRef = useRef<Level>(new Level());
  const platformsRef = useRef<Platform[]>([]);
  const sceneRef = useRef<Phaser.Scene | null>(null);
  const previewRef = useRef<Phaser.GameObjects.Sprite | null>(null);
  const { editorItem, setEditorItem } = useStore();
  const previewSizeRef = useRef<number | undefined>(undefined);
  const playerSizeRef = useRef<number | undefined>(undefined); // Начальный размер игрока
  const draggedPlatformRef = useRef<Platform | null>(null);

  const resetPreview = () => {
    if (previewRef.current) {
      previewRef.current.destroy();
      previewRef.current = null;
    }
    setEditorItem(null);
  };

  const createPreview = (type: EditorItem) => {
    if (sceneRef.current) {
      resetPreview();
      const ctx = sceneRef.current;
      const cfg = { x: 0, y: 0 };
      const item = itemGetter(type, ctx, cfg);
      const defaultSize = item.getSize();
      previewSizeRef.current = defaultSize;
      previewRef.current = ctx.add.sprite(0, 0, item.texture.key);
      previewRef.current.setAlpha(0.5);
      previewRef.current.setDisplaySize(defaultSize, defaultSize);
      item.destroy();
    }
  };

  const itemGetter = (
    itemName: string,
    ctx: Phaser.Scene,
    cfg: { x: number; y: number }
  ) => {
    const config = { ...cfg, isEditor: true };
    switch (itemName) {
      case EditorItem.ASTEROID:
        return new Asteroid(ctx, config);
      default:
        return new Platform(ctx, config);
    }
  };

  const updatePreviewSize = (delta: number) => {
    if (
      !editorItem ||
      !previewRef.current ||
      !previewSizeRef.current ||
      !playerSizeRef.current
    )
      return;

    // Изменяем размер с учетом направления прокрутки
    const sizeChange = delta < 0 ? 10 : -10;

    const minSize = playerSizeRef.current;
    const maxSize = playerSizeRef.current * 5;
    const newSize = Math.max(
      minSize,
      Math.min(maxSize, previewSizeRef.current + sizeChange)
    );

    if (newSize !== previewSizeRef.current) {
      previewSizeRef.current = newSize;
      previewRef.current.setDisplaySize(newSize, newSize);

      // Обновляем текстуру превью с новым размером
      const ctx = sceneRef.current!;
      const cfg = { x: 0, y: 0, size: newSize };
      const item = itemGetter(editorItem, ctx, cfg);
      previewRef.current.setTexture(item.texture.key);
      item.destroy();
    }
  };

  const updatePlatformSize = (platform: Platform, delta: number) => {
    if (!playerSizeRef.current) return;

    const currentSize = platform.getSize();
    const sizeChange = delta < 0 ? 10 : -10;
    const minSize = playerSizeRef.current;
    const maxSize = playerSizeRef.current * 5;
    const newSize = Math.max(
      minSize,
      Math.min(maxSize, currentSize + sizeChange)
    );

    if (newSize !== currentSize) {
      // Обновляем размер платформы
      const index = platformsRef.current.indexOf(platform);
      if (index !== -1) {
        // Создаем новую платформу с обновленным размером
        const cfg = {
          x: platform.x,
          y: platform.y,
          size: newSize,
          type: platform.getData("type"),
        };
        const newPlatform = itemGetter(
          cfg.type || EditorItem.ASTEROID,
          sceneRef.current!,
          cfg
        );

        // Заменяем старую платформу на новую
        platform.destroy();
        platformsRef.current[index] = newPlatform;

        // Обновляем данные в levelRef
        const platforms = levelRef.current.getPlatforms();
        platforms[index] = { ...platforms[index], size: newSize };
      }
    }
  };

  const startDrag = (platform: Platform) => {
    draggedPlatformRef.current = platform;
  };

  const stopDrag = () => {
    if (draggedPlatformRef.current) {
      draggedPlatformRef.current = null;
      if (sceneRef.current) {
        sceneRef.current.input.setDefaultCursor("default");
      }
    }
  };

  const updateDragPosition = (pointer: Phaser.Input.Pointer) => {
    if (draggedPlatformRef.current) {
      draggedPlatformRef.current.setPosition(pointer.x, pointer.y);

      const index = platformsRef.current.indexOf(draggedPlatformRef.current);
      if (index !== -1) {
        const platforms = levelRef.current.getPlatforms();
        platforms[index] = { ...platforms[index], x: pointer.x, y: pointer.y };
      }
    }
  };

  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight,
      },
      parent: phaserRef.current!,
      scene: {
        preload: function () {},
        create: function () {
          sceneRef.current = this;

          // Создаем временного игрока для определения размеров
          const tempPlayer = new Player(this);
          playerSizeRef.current = tempPlayer.getSize();
          tempPlayer.destroy();

          // Создаем спрайт для предварительного просмотра
          previewRef.current = this.add.sprite(0, 0, "");
          previewRef.current.setAlpha(0.5);
          previewRef.current.setVisible(false);

          // Инициализируем предпросмотр астероида
          if (editorItem) {
            createPreview(editorItem);
          }

          // Обработчик движения мыши
          this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
            if (previewRef.current) {
              previewRef.current.setPosition(pointer.x, pointer.y);
              previewRef.current.setVisible(true);
            } else if (draggedPlatformRef.current) {
              updateDragPosition(pointer);
            } else {
              // Проверяем наведение на платформу
              const platform = platformsRef.current.find((p) => {
                const bounds = p.getBounds();
                return bounds.contains(pointer.x, pointer.y);
              });

              if (platform) {
                this.input.setDefaultCursor("grab");
              } else {
                this.input.setDefaultCursor("default");
              }
            }
          });

          // Обработчик колесика мыши
          this.input.on(
            "wheel",
            (
              _pointer: Phaser.Input.Pointer,
              _gameObjects: any[],
              _deltaX: number,
              deltaY: number
            ) => {
              if (previewRef.current) {
                updatePreviewSize(deltaY);
              } else {
                const pointer = this.input.activePointer;
                const platform = platformsRef.current.find((p) => {
                  const bounds = p.getBounds();
                  return bounds.contains(pointer.x, pointer.y);
                });

                if (platform) {
                  updatePlatformSize(platform, deltaY);
                }
              }
            }
          );

          // Обработчик клика
          this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            // Очищаем предварительный просмотр при правом клике
            if (pointer.rightButtonDown()) {
              resetPreview();
              return;
            }

            // Если нет выбранного объекта, проверяем клик по платформе
            if (!previewRef.current) {
              if (sceneRef.current) {
                sceneRef.current.input.setDefaultCursor("grabbing");
              }
              const platform = platformsRef.current.find((p) => {
                const bounds = p.getBounds();
                return bounds.contains(pointer.x, pointer.y);
              });

              if (platform) {
                startDrag(platform);
              }
              return;
            }

            // Если есть выбранный объект, создаем новую платформу
            if (!previewRef.current || !editorItem) return;

            let platform;
            const cfg = {
              x: pointer.x,
              y: pointer.y,
              size: previewSizeRef.current,
            };
            platform = itemGetter(editorItem, this, cfg);
            platform.setData("type", editorItem);
            platformsRef.current.push(platform);
            levelRef.current.addPlatform({ ...cfg, type: editorItem });
          });

          this.input.on("pointerup", () => {
            stopDrag();
          });
        },
      },
      physics: { default: "arcade" },
    };

    const game = new Phaser.Game(config);

    // Добавляем обработчик resize
    const handleResize = () => {
      game.scale.resize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      game.destroy(true);
    };
  }, []);

  const saveLevel = () => {
    localStorage.setItem(LEVEL_STORAGE_KEY, levelRef.current.toJSON());
    alert("Уровень сохранён!");
  };

  const loadLevel = () => {
    const json = localStorage.getItem(LEVEL_STORAGE_KEY);
    if (json && sceneRef.current) {
      const level = Level.fromJSON(json);
      levelRef.current = level;
      platformsRef.current.forEach((p) => p.destroy());
      platformsRef.current = [];
      (level.getPlatforms() as PlatformConfigWithType[]).forEach((cfg) => {
        let platform;
        if (cfg.type === EditorItem.ASTEROID) {
          platform = new Asteroid(sceneRef.current!, cfg);
        } else {
          platform = new Platform(sceneRef.current!, cfg);
        }
        platformsRef.current.push(platform);
      });
    }
  };

  // Обработчик контекстного меню
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <EditorContainer onContextMenu={handleContextMenu}>
      <LevelEditorTools
        onSave={saveLevel}
        onLoad={loadLevel}
        onCreatePreview={createPreview}
      />
      <EditorCanvas ref={phaserRef} />
    </EditorContainer>
  );
};

export default LevelEditor;
