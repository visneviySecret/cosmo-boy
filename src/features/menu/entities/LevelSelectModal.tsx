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

type Level = {
  id: string;
  name: string;
};

type LevelSelectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (levelKey: string) => void;
  onLoad: () => void;
};

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onLoad,
}) => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  // TODO: доставать выбранный уровень из памяти

  const handleSelectChange = (value: Level) => {
    const level = { id: value.id, name: value.name };
    setSelectedLevel(level);
  };

  const handleCreateNewLevel = () => {
    const id = String(levels.length + 1);
    const name = `Уровень ${id}`;
    const newLevel: Level = { id, name };
    const savedLevels = localStorage.getItem("gameLevels");
    const parsedLevels = savedLevels ? JSON.parse(savedLevels) : [];
    const updatedLevels = [...parsedLevels, newLevel];
    setLevels(updatedLevels);
    localStorage.setItem("gameLevels", JSON.stringify(updatedLevels));
  };

  const handleDeleteLevel = (levelId: string) => {
    //   TODO: если уровень не пустой, то выводить модалку подтверждения
    const savedLevels = localStorage.getItem("gameLevels");
    if (savedLevels) {
      const levels = JSON.parse(savedLevels);
      const updatedLevels = levels.filter(
        (level: Level) => level.id !== levelId
      );
      localStorage.setItem("gameLevels", JSON.stringify(updatedLevels));
      setLevels(updatedLevels);
    }
  };

  useEffect(() => {
    const savedLevel = localStorage.getItem("savedLevel");
    if (savedLevel) {
      setSelectedLevel(JSON.parse(savedLevel));
    }
    const savedLevels = localStorage.getItem("gameLevels");
    if (savedLevels) {
      setLevels(JSON.parse(savedLevels));
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
                onClick={() => handleDeleteLevel(level.id)}
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
        <Button
          onClick={() => onSave(selectedLevel?.id || "")}
          $variant="primary"
        >
          Сохранить
        </Button>
        <Button onClick={onLoad} $variant="secondary">
          Загрузить
        </Button>
      </ButtonGroup>
    </ModalOverlay>
  );
};
