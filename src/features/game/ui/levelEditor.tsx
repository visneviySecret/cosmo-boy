import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import { Level } from "../entities/Level";
import { Platform } from "../entities/Platform";
import type { PlatformConfig } from "../entities/Platform";
import {
  EditorContainer,
  EditorPanel,
  EditorButton,
  EditorCanvas,
} from "./LevelEditor.styled";

const LEVEL_STORAGE_KEY = "custom_level";

const LevelEditor: React.FC = () => {
  const phaserRef = useRef<HTMLDivElement>(null);
  const levelRef = useRef<Level>(new Level());
  const platformsRef = useRef<Platform[]>([]);
  const sceneRef = useRef<Phaser.Scene | null>(null);

  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: phaserRef.current!,
      scene: {
        preload: function () {},
        create: function () {
          sceneRef.current = this;
          this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            const platform = new Platform(this, { x: pointer.x, y: pointer.y });
            platformsRef.current.push(platform);
            levelRef.current.addPlatform({ x: pointer.x, y: pointer.y });
          });
        },
        update: function () {},
      },
      physics: { default: "arcade" },
    };
    const game = new Phaser.Game(config);
    return () => {
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
      // Удаляем старые платформы
      platformsRef.current.forEach((p) => p.destroy());
      platformsRef.current = [];
      // Добавляем платформы из уровня
      level.getPlatforms().forEach((cfg: PlatformConfig) => {
        const platform = new Platform(sceneRef.current!, cfg);
        platformsRef.current.push(platform);
      });
    }
  };

  return (
    <EditorContainer>
      <EditorPanel>
        <EditorButton onClick={saveLevel}>Сохранить</EditorButton>
        <EditorButton onClick={loadLevel}>Загрузить</EditorButton>
      </EditorPanel>
      <EditorCanvas ref={phaserRef} />
    </EditorContainer>
  );
};

export default LevelEditor;
