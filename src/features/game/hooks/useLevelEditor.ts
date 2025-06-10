import { useRef, useEffect } from "react";
import Phaser from "phaser";
import { Level, type LevelData } from "../entities/Level";
import { Platform } from "../entities/Platform";
import { Player } from "../entities/Player";
import { Asteroid } from "../entities/Asteroid";
import { useStore } from "../../../shared/store";
import { EditorItem } from "../../../shared/types/editor";
import { itemGetter, type PlatformConfigWithType } from "../utils/editorUtils";

export const useLevelEditor = () => {
  const phaserRef = useRef<HTMLDivElement>(null);
  const levelRef = useRef<Level>(new Level());
  const saveLevel = levelRef.current.saveLevel.bind(levelRef.current);
  const platformsRef = useRef<Platform[]>([]);
  const sceneRef = useRef<Phaser.Scene | null>(null);
  const previewRef = useRef<Phaser.GameObjects.Sprite | null>(null);
  const { editorItem, setEditorItem } = useStore();
  const previewSizeRef = useRef<number | undefined>(undefined);
  const playerSizeRef = useRef<number | undefined>(undefined);
  const draggedPlatformRef = useRef<Platform | null>(null);
  const hoveredPlatformRef = useRef<Platform | null>(null);

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
      const camera = ctx.cameras.main;
      const cfg = {
        x: camera.scrollX + camera.width / 2,
        y: camera.scrollY + camera.height / 2,
      };
      const item = itemGetter(type, ctx, cfg);
      const defaultSize = item.getSize();
      previewSizeRef.current = defaultSize;
      previewRef.current = ctx.add.sprite(cfg.x, cfg.y, item.texture.key);
      previewRef.current.setAlpha(0.5);
      previewRef.current.setDisplaySize(defaultSize, defaultSize);
      item.destroy();
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
      const index = platformsRef.current.indexOf(platform);
      if (index !== -1) {
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

        platform.destroy();
        platformsRef.current[index] = newPlatform;

        const platforms = levelRef.current?.getPlatforms() || [];
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
    if (draggedPlatformRef.current && sceneRef.current) {
      const camera = sceneRef.current.cameras.main;
      const worldX = pointer.x + camera.scrollX;
      const worldY = pointer.y + camera.scrollY;

      draggedPlatformRef.current.setPosition(worldX, worldY);

      const index = platformsRef.current.indexOf(draggedPlatformRef.current);
      if (index !== -1) {
        const platforms = levelRef.current?.getPlatforms() || [];
        platforms[index] = { ...platforms[index], x: worldX, y: worldY };
      }
    }
  };

  const updatePreviewPosition = (pointer: Phaser.Input.Pointer) => {
    if (previewRef.current && sceneRef.current) {
      const camera = sceneRef.current.cameras.main;
      previewRef.current.setPosition(
        camera.scrollX + pointer.x,
        camera.scrollY + pointer.y
      );
    }
  };

  const loadLevel = (id: string) => {
    const json = localStorage.getItem("gameLevels");
    if (!json) {
      alert("Нет сохраненных уровней");
      return;
    }

    const levels = JSON.parse(json);
    const data = levels.find((level: LevelData) => level.id === id);

    if (!data) {
      alert("Уровень не найден" + id);
      return;
    }

    try {
      const storedLevel = new Level(data);

      levelRef.current = storedLevel;

      // Очищаем существующие платформы
      platformsRef.current.forEach((p) => p.destroy());
      platformsRef.current = [];

      // Создаем новые платформы
      const platforms = storedLevel.getPlatforms();

      platforms.forEach((cfg: PlatformConfigWithType) => {
        let platform;
        let editModeCfg = { ...cfg, isEditor: true };
        if (editModeCfg.type === EditorItem.ASTEROID) {
          platform = new Asteroid(sceneRef.current!, editModeCfg);
        } else {
          platform = new Platform(sceneRef.current!, editModeCfg);
        }
        platformsRef.current.push(platform);
      });
    } catch (error) {
      alert("Ошибка при загрузке уровня:" + error);
    }
  };

  const deleteHoveredPlatform = () => {
    if (hoveredPlatformRef.current) {
      const index = platformsRef.current.indexOf(hoveredPlatformRef.current);
      if (index !== -1) {
        hoveredPlatformRef.current.destroy();
        platformsRef.current.splice(index, 1);
        const platforms = levelRef.current?.getPlatforms();
        platforms?.splice(index, 1);
      }
      hoveredPlatformRef.current = null;
    }
  };

  useEffect(() => {
    const loadedLevel = localStorage.getItem("loadedLevel");
    if (loadedLevel) {
      loadLevel(loadedLevel);
    }

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

          const tempPlayer = new Player(this);
          playerSizeRef.current = tempPlayer.getSize();
          tempPlayer.destroy();

          previewRef.current = this.add.sprite(0, 0, "");
          previewRef.current.setAlpha(0.5);
          previewRef.current.setVisible(false);

          if (editorItem) {
            createPreview(editorItem);
          }

          this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
            if (previewRef.current) {
              updatePreviewPosition(pointer);
              previewRef.current.setVisible(true);
            } else if (draggedPlatformRef.current) {
              updateDragPosition(pointer);
            } else {
              const platform = platformsRef.current.find((p) => {
                const bounds = p.getBounds();
                return bounds.contains(
                  pointer.x + this.cameras.main.scrollX,
                  pointer.y + this.cameras.main.scrollY
                );
              });

              if (platform) {
                this.input.setDefaultCursor("grab");
                hoveredPlatformRef.current = platform;
              } else {
                this.input.setDefaultCursor("default");
                hoveredPlatformRef.current = null;
              }
            }
          });

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
                  return bounds.contains(
                    pointer.x + this.cameras.main.scrollX,
                    pointer.y + this.cameras.main.scrollY
                  );
                });

                if (platform) {
                  updatePlatformSize(platform, deltaY);
                }
              }
            }
          );

          this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            if (pointer.rightButtonDown()) {
              resetPreview();
              return;
            }

            if (!previewRef.current) {
              if (sceneRef.current) {
                sceneRef.current.input.setDefaultCursor("grabbing");
              }
              const platform = platformsRef.current.find((p) => {
                const bounds = p.getBounds();
                return bounds.contains(
                  pointer.x + this.cameras.main.scrollX,
                  pointer.y + this.cameras.main.scrollY
                );
              });

              if (platform) {
                startDrag(platform);
              }
              return;
            }

            if (!previewRef.current || !editorItem) return;

            const camera = this.cameras.main;
            let platform;
            const cfg = {
              x: pointer.x + camera.scrollX,
              y: pointer.y + camera.scrollY,
              size: previewSizeRef.current,
            };
            platform = itemGetter(editorItem, this, cfg);
            platform.setData("type", editorItem);
            platformsRef.current.push(platform);
            levelRef.current?.addPlatform({ ...cfg, type: editorItem });
          });

          this.input.on("pointerup", () => {
            stopDrag();
          });
        },
      },
      physics: { default: "arcade" },
    };

    const game = new Phaser.Game(config);

    const handleResize = () => {
      game.scale.resize(window.innerWidth, window.innerHeight);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete") {
        deleteHoveredPlatform();
      }

      if (sceneRef.current) {
        const camera = sceneRef.current.cameras.main;
        const moveSpeed = 100;
        if ((e.key === "a" || e.key === "ф") && camera.scrollX > 0) {
          camera.scrollX -= moveSpeed;
        }
        if (e.key === "d" || e.key === "в") {
          camera.scrollX += moveSpeed;
        }
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
      game.destroy(true);
    };
  }, []);

  return {
    phaserRef,
    saveLevel,
    loadLevel,
    createPreview,
  };
};
