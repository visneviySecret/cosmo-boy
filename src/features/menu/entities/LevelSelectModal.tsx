import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
import { getLevels } from "../../game/utils/customLevel";
import { isDemoRoute } from "../../game/ui/GameRoot";

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
  const { t } = useTranslation();

  const handleSelectChange = (value: LevelData, isLoad = true) => {
    const level = {
      id: value.id,
      name: value.name,
      gameObjects: value.gameObjects || [],
    };
    setSelectedLevel(level);
    isLoad && onLoad(value.id);

    // Сохраняем текущий редактируемый уровень отдельно
    localStorage.setItem("current_level", JSON.stringify(level));
  };

  const handleCreateNewLevel = () => {
    if (!isDemoRoute) {
      alert(t("levelSelect.createOnlyDemo"));
      return;
    }

    const isExistLevelsInStorage = levels.length !== 0;
    const id = isExistLevelsInStorage
      ? String(Number(levels[levels.length - 1].id) + 1)
      : "1";
    const name = t("levelSelect.level", { id });
    const newLevel: LevelData = { id, name, gameObjects: [] };

    const updatedLevels = [...levels, newLevel];

    localStorage.setItem(LEVEL_STORAGE_KEY, JSON.stringify(updatedLevels));

    setLevels(updatedLevels);
    handleSelectChange(newLevel, false);
    onSave(newLevel);
  };

  const handleDeleteLevel = (
    e: React.MouseEvent<HTMLButtonElement>,
    levelId: string
  ) => {
    e.stopPropagation();

    if (!isDemoRoute) {
      alert(t("levelSelect.deleteOnlyDemo"));
      return;
    }

    const deletedLevel = levels.find((level) => level.id === levelId);
    const hasObjects = deletedLevel?.gameObjects?.length;

    if (hasObjects) {
      const response = confirm(t("levelSelect.deleteConfirm"));
      if (!response) return;
    }

    const updatedLevels = levels.filter((level) => level.id !== levelId);

    localStorage.setItem(LEVEL_STORAGE_KEY, JSON.stringify(updatedLevels));

    setLevels(updatedLevels);
  };

  useEffect(() => {
    const jsonLevels = getLevels();
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
                disabled={!isDemoRoute}
                title={
                  !isDemoRoute
                    ? t("levelSelect.deleteTooltip")
                    : t("common.delete")
                }
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
        disabled={!isDemoRoute}
        title={
          !isDemoRoute
            ? t("levelSelect.createTooltip")
            : t("levelSelect.createNew")
        }
      >
        {t("levelSelect.createNew")}
      </Button>
      <ButtonGroup>
        <Button onClick={() => onSave(selectedLevel)} $variant="primary">
          {t("common.save")}
        </Button>
        <Button onClick={onClose} $variant="secondary">
          {t("common.close")}
        </Button>
      </ButtonGroup>
    </ModalOverlay>
  );
};
