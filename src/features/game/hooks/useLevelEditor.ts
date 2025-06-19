import { useRef, useEffect } from "react";
import Phaser from "phaser";
import { Level, type LevelData } from "../entities/Level";
import { Platform as GameObject } from "../entities/Platform";
import { Player } from "../entities/Player";
import { useStore } from "../../../shared/store";
import { EditorItem } from "../../../shared/types/editor";
import {
  GAME_LEVELS_STORAGE_KEY,
  LEVEL_STORAGE_KEY,
} from "../utils/editorUtils";
import { getGameObjectByType } from "../utils/customLevel";
import { preload } from "../utils/scene";
import type { GameObjects } from "../../../shared/types/game";
import { ParallaxBackground } from "../entities/ParallaxBackground";

export const useLevelEditor = () => {
  const sceneRef = useRef<Phaser.Scene | null>(null);
  const phaserRef = useRef<HTMLDivElement>(null);
  const levelRef = useRef<Level>(new Level());
  const saveLevel = levelRef.current.saveLevel.bind(levelRef.current);
  const gameObjectsRef = useRef<GameObjects[]>([]);
  const previewRef = useRef<Phaser.GameObjects.Sprite | null>(null);
  const { editorItem, setEditorItem, cameraX, cameraY } = useStore();
  const editorItemRef = useRef<EditorItem | null>(null);
  const previewSizeRef = useRef<number | undefined>(undefined);
  const playerSizeRef = useRef<number | undefined>(undefined);
  const draggedGameObjectRef = useRef<GameObject | null>(null);
  const hoveredPlatformRef = useRef<GameObject | null>(null);
  const parallaxBackgroundRef = useRef<ParallaxBackground | null>(null);
  let parallaxBackground: ParallaxBackground;

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
      setEditorItem(type);
      const ctx = sceneRef.current;
      const camera = ctx.cameras.main;
      const centerScreenX = camera.width / 2;
      const centerScreenY = camera.height / 2;
      const worldCenterX = camera.scrollX + centerScreenX / camera.zoom;
      const worldCenterY = camera.scrollY + centerScreenY / camera.zoom;

      const cfg = {
        x: worldCenterX,
        y: worldCenterY,
        isEditor: true,
        type,
      };
      const item = getGameObjectByType(sceneRef.current!, cfg);
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
      !editorItemRef.current ||
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

      const cfg = { x: 0, y: 0, size: newSize, type: editorItemRef.current };
      const item = getGameObjectByType(sceneRef.current!, cfg);
      previewRef.current.setTexture(item.texture.key);
      item.destroy();
    }
  };

  const updatePlatformSize = (platform: GameObject, delta: number) => {
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
      const index = gameObjectsRef.current.indexOf(platform);
      if (index !== -1) {
        const cfg = {
          x: platform.x,
          y: platform.y,
          size: newSize,
          type: platform.getType(),
        };
        const newGameObject = getGameObjectByType(sceneRef.current!, cfg);

        platform.destroy();
        gameObjectsRef.current[index] = newGameObject;

        const platforms = levelRef.current?.getGameObjects() || [];
        platforms[index] = { ...platforms[index], size: newSize };
      }
    }
    saveLevel(levelRef.current.toJSON());
  };

  const startDrag = (gameObject: GameObject) => {
    draggedGameObjectRef.current = gameObject;
  };

  const stopDrag = () => {
    if (draggedGameObjectRef.current) {
      draggedGameObjectRef.current = null;
      if (sceneRef.current) {
        sceneRef.current.input.setDefaultCursor("default");
      }
      saveLevel(levelRef.current.toJSON());
    }
  };

  const updateDragPosition = (pointer: Phaser.Input.Pointer) => {
    if (draggedGameObjectRef.current && sceneRef.current) {
      const worldX = pointer.worldX;
      const worldY = pointer.worldY;

      draggedGameObjectRef.current.setPosition(worldX, worldY);

      const index = gameObjectsRef.current.indexOf(
        draggedGameObjectRef.current
      );
      if (index !== -1) {
        const platforms = levelRef.current?.getGameObjects() || [];
        platforms[index] = { ...platforms[index], x: worldX, y: worldY };
      }
    }
  };

  const updatePreviewPosition = (pointer: Phaser.Input.Pointer) => {
    if (previewRef.current && sceneRef.current) {
      const worldX = pointer.worldX;
      const worldY = pointer.worldY;
      previewRef.current.setPosition(worldX, worldY);
    }
  };

  const loadLevel = (id: string) => {
    if (!sceneRef.current) {
      alert("Сцена не инициализирована");
      return;
    }

    const json = localStorage.getItem(GAME_LEVELS_STORAGE_KEY);
    if (!json) {
      alert("Нет сохраненных уровней");
      return;
    }

    const levels = JSON.parse(json);
    const data = levels.find((level: LevelData) => level.id === id);

    if (!data) {
      alert(`Уровень с id ${id} не найден`);
      return;
    }

    try {
      const storedLevel = new Level(data);
      levelRef.current = storedLevel;

      // Очищаем существующие объекты
      gameObjectsRef.current.forEach((p) => p.destroy());
      gameObjectsRef.current = [];

      // Создаем все игровые объекты
      const gameObjectConfigs = storedLevel.getGameObjects();

      gameObjectConfigs.forEach((cfg) => {
        let editModeCfg = { ...cfg, isEditor: true };
        const gameObject = getGameObjectByType(sceneRef.current!, editModeCfg);
        gameObjectsRef.current.push(gameObject);
      });
    } catch (error) {
      alert("Ошибка при загрузке уровня: " + error);
    }
  };

  const deleteHoveredPlatform = () => {
    if (hoveredPlatformRef.current) {
      const index = gameObjectsRef.current.indexOf(hoveredPlatformRef.current);
      if (index !== -1) {
        levelRef.current.removeGameObject(hoveredPlatformRef.current);
        gameObjectsRef.current.splice(index, 1);
      }
      hoveredPlatformRef.current = null;
    }
  };

  useEffect(() => {
    editorItemRef.current = editorItem;
  }, [editorItem]);

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
        preload: preload,
        create: function () {
          sceneRef.current = this;

          parallaxBackground = new ParallaxBackground(this);
          parallaxBackgroundRef.current = parallaxBackground;

          // Устанавливаем позицию камеры из игры, если она есть
          if (cameraX !== undefined && cameraY !== undefined) {
            this.cameras.main.scrollX = cameraX;
            this.cameras.main.scrollY = cameraY;
          }

          this.cameras.main.setZoom(0.5);

          const tempPlayer = new Player(this);
          playerSizeRef.current = tempPlayer.getSize();
          tempPlayer.destroy();

          previewRef.current = this.add.sprite(0, 0, "");
          previewRef.current.setAlpha(0.5);
          previewRef.current.setVisible(false);

          // Загружаем сохраненный уровень после инициализации сцены
          const customLevel = localStorage.getItem(LEVEL_STORAGE_KEY);
          if (customLevel) {
            const levelData = JSON.parse(customLevel);
            loadLevel(levelData.id);
          }

          if (editorItem) {
            createPreview(editorItem);
          }

          this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
            if (previewRef.current) {
              updatePreviewPosition(pointer);
              previewRef.current.setVisible(true);
            } else if (draggedGameObjectRef.current) {
              updateDragPosition(pointer);
            } else {
              const worldX = pointer.worldX;
              const worldY = pointer.worldY;

              const gameObject = gameObjectsRef.current.find((p) => {
                const gameObjectBounds = p.getBounds();
                return gameObjectBounds.contains(worldX, worldY);
              });

              if (gameObject) {
                this.input.setDefaultCursor("grab");
                hoveredPlatformRef.current = gameObject as GameObject;
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
                const worldX = pointer.worldX;
                const worldY = pointer.worldY;

                const platform = gameObjectsRef.current.find((p) => {
                  const bounds = p.getBounds();
                  if (p instanceof GameObject) {
                    return bounds.contains(worldX, worldY);
                  }
                }) as GameObject;
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
              const worldX = pointer.worldX;
              const worldY = pointer.worldY;

              const gameObject = gameObjectsRef.current.find((p) => {
                const bounds = p.getBounds();
                return bounds.contains(worldX, worldY);
              }) as GameObject;

              if (gameObject) {
                startDrag(gameObject);
              }
              return;
            }

            if (!previewRef.current || !editorItemRef.current) return;

            const worldX = pointer.worldX;
            const worldY = pointer.worldY;

            const cfg = {
              x: worldX,
              y: worldY,
              size: previewSizeRef.current,
              type: editorItemRef.current,
            };

            const gameObject = getGameObjectByType(sceneRef.current!, cfg);
            gameObject.setData("type", editorItem);
            gameObjectsRef.current.push(gameObject);
            levelRef.current?.addGameObject({
              ...cfg,
              type: editorItemRef.current,
            });
          });

          this.input.on("pointerup", () => {
            stopDrag();
          });
        },
      },
      physics: {
        default: "arcade",
        arcade: {
          debug: process.env.NODE_ENV === "development",
        },
      },
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
