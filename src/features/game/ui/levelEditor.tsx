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

const LEVEL_STORAGE_KEY = "custom_level";

type PlatformConfigWithType = PlatformConfig & { type?: string };

const LevelEditor: React.FC = () => {
  const phaserRef = useRef<HTMLDivElement>(null);
  const levelRef = useRef<Level>(new Level());
  const platformsRef = useRef<Platform[]>([]);
  const sceneRef = useRef<Phaser.Scene | null>(null);
  const previewRef = useRef<Phaser.GameObjects.Sprite | null>(null);
  const { editorItem } = useStore();

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

          // Создаем спрайт для предварительного просмотра
          previewRef.current = this.add.sprite(0, 0, "");
          previewRef.current.setAlpha(0.5);
          previewRef.current.setVisible(false);

          // Обработчик движения мыши
          this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
            if (previewRef.current) {
              previewRef.current.setPosition(pointer.x, pointer.y);
              previewRef.current.setVisible(true);
            }
          });

          // Обработчик клика
          this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            let platform;
            const cfg = { x: pointer.x, y: pointer.y };
            if (editorItem === EditorItem.ASTEROID) {
              platform = new Asteroid(this, cfg);
            } else {
              platform = new Platform(this, cfg);
            }
            platformsRef.current.push(platform);
            levelRef.current.addPlatform({ ...cfg, type: editorItem });
          });
        },
        update: function (this: Phaser.Scene) {
          // Обновляем текстуру предварительного просмотра при изменении выбранного элемента
          if (previewRef.current && editorItem) {
            createPreviewTexture(this, editorItem);
            previewRef.current.setTexture("preview");
          }
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
  }, [editorItem]);

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

  return (
    <EditorContainer>
      <LevelEditorTools onSave={saveLevel} onLoad={loadLevel} />
      <EditorCanvas ref={phaserRef} />
    </EditorContainer>
  );
};

const createPreviewTexture = (
  scene: Phaser.Scene,
  editorItem: EditorItem
): void => {
  const graphics = scene.add.graphics();
  if (editorItem === EditorItem.ASTEROID) {
    graphics.fillStyle(0xcccccc, 1);
    graphics.fillCircle(100, 100, 100);
  } else {
    graphics.fillStyle(0x00ff00, 1);
    graphics.fillRect(0, 0, 200, 200);
  }
  graphics.generateTexture("preview", 200, 200);
  graphics.destroy();
};

export default LevelEditor;
