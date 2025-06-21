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
import { LEVEL_STORAGE_KEY } from "../../game/utils/editorUtils";
import { getAllLevels } from "../../game/utils/customLevel";

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
      gameObjects: value.gameObjects || [],
    };
    setSelectedLevel(level);
    isLoad && onLoad(value.id);
    localStorage.setItem(LEVEL_STORAGE_KEY, JSON.stringify(level));
  };

  const handleCreateNewLevel = () => {
    alert(
      "Создание новых уровней недоступно. Уровни загружаются из game_levels.json"
    );
  };

  const handleDeleteLevel = (
    e: React.MouseEvent<HTMLButtonElement>,
    levelId: string
  ) => {
    e.stopPropagation();
    alert(
      "Удаление уровней недоступно. Уровни загружаются из game_levels.json"
    );
  };

  useEffect(() => {
    const jsonLevels = getAllLevels();
    setLevels(jsonLevels);
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
                disabled={true}
                title="Удаление недоступно для уровней из JSON"
              >
                ✕
              </Button>
            </div>
          </LevelItem>
        ))}
      </LevelList>
      <Button
        $variant="primary"
        onClick={handleCreateNewLevel}
        disabled={true}
        title="Создание недоступно для уровней из JSON"
      >
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
