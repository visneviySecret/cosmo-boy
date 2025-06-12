import React, { useState, useEffect } from "react";
import { Button } from "../../../shared/ui/Button";
import { ModalOverlay } from "../../../shared/ui/ModalOverlay";
import {
  ButtonGroup,
  LevelItem,
  LevelItemLabel,
  LevelList,
  RadioButton,
} from "./LevelSelectModal.style";
import type { LevelData } from "../../game/entities/Level";
import {
  GAME_LEVELS_STORAGE_KEY,
  LEVEL_STORAGE_KEY,
} from "../../game/utils/editorUtils";

type LevelSelectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (props: LevelData | null) => void;
  onLoad: (levelId: string) => void;
};

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onLoad,
}) => {
  const [levels, setLevels] = useState<LevelData[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<LevelData | null>(null);

  const handleSelectChange = (value: LevelData, isLoad = true) => {
    const level = {
      id: value.id,
      name: value.name,
      platforms: value.platforms,
    };
    setSelectedLevel(level);
    isLoad && onLoad(value.id);
    localStorage.setItem(LEVEL_STORAGE_KEY, JSON.stringify(level));
  };

  const handleCreateNewLevel = () => {
    const isExistLevelsInStorage = levels.length !== 0;
    const id = isExistLevelsInStorage
      ? String(Number(levels[levels.length - 1].id) + 1)
      : "1";
    const name = `Уровень ${id}`;
    const newLevel: LevelData = { id, name, platforms: [] };
    let updatedLevels = [];
    if (!isExistLevelsInStorage) {
      handleSelectChange(newLevel, false);
      onSave(newLevel);
      updatedLevels = [newLevel];
    } else {
      const savedLevels = localStorage.getItem(GAME_LEVELS_STORAGE_KEY);
      const parsedLevels = savedLevels ? JSON.parse(savedLevels) : [];
      updatedLevels = [...parsedLevels, newLevel];
      localStorage.setItem(
        GAME_LEVELS_STORAGE_KEY,
        JSON.stringify(updatedLevels)
      );
      localStorage.setItem(LEVEL_STORAGE_KEY, JSON.stringify(newLevel));
    }
    setLevels(updatedLevels);
  };

  const handleDeleteLevel = (
    e: React.MouseEvent<HTMLButtonElement>,
    levelId: string
  ) => {
    e.stopPropagation();
    const savedLevelsJson = localStorage.getItem(GAME_LEVELS_STORAGE_KEY);

    if (savedLevelsJson) {
      const savedLevels = JSON.parse(savedLevelsJson);
      const deletedLevel = savedLevels.find(
        (level: LevelData) => level.id === levelId
      );
      if (deletedLevel?.platforms?.length) {
        const response = confirm(
          "Уровень содержкит платформы, действительно удалить?"
        );
        if (!response) return;
      }
      const updatedLevels = savedLevels.filter(
        (level: LevelData) => level.id !== levelId
      );
      localStorage.setItem(
        GAME_LEVELS_STORAGE_KEY,
        JSON.stringify(updatedLevels)
      );
      setLevels(updatedLevels);
    }
  };

  useEffect(() => {
    const gameLevels = localStorage.getItem(GAME_LEVELS_STORAGE_KEY);
    if (gameLevels) {
      setLevels(JSON.parse(gameLevels));
    }
  }, []);

  return (
    <ModalOverlay onClose={onClose} isOpen={isOpen}>
      <LevelList>
        {levels.map((level) => (
          <LevelItem
            key={level.id}
            onClick={() => handleSelectChange(level)}
            name={level.name}
            id={level.id}
          >
            <RadioButton
              type="radio"
              value={level.name}
              name={level.name}
              id={level.id}
              checked={selectedLevel?.id === level.id}
              onChange={() => handleSelectChange(level)}
            />
            <LevelItemLabel>{level.name}</LevelItemLabel>
            <div>
              <Button
                $variant="danger"
                onClick={(e) => handleDeleteLevel(e, level.id)}
              >
                ✕
              </Button>
            </div>
          </LevelItem>
        ))}
      </LevelList>
      <Button $variant="primary" onClick={handleCreateNewLevel}>
        Создать новый уровень
      </Button>
      <ButtonGroup>
        <Button onClick={() => onSave(selectedLevel)} $variant="primary">
          Сохранить
        </Button>
        <Button onClick={onClose} $variant="secondary">
          Закрыть
        </Button>
      </ButtonGroup>
    </ModalOverlay>
  );
};
