import React, { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Button } from "../../../shared/ui/Button";
import { EditorPanel, EditorToolsWrapper } from "./LevelEditor.styled";
// import { useStore } from "../../../shared/store";
import { EditorItem } from "../../../shared/types/editor";
import PlatformTypeSelector from "../../../entities/PlatformTypeSelector/PlatformTypeSelector";
import { CollectablesSelector } from "../../../entities/CollectablesSelector/CollectablesSelector";
import { LevelSelectModal } from "../../menu/entities/LevelSelectModal";
import type { LevelData } from "../entities/Level";

type LevelEditorToolsProps = {
  onSave: (data: LevelData | null) => void;
  onLoad: (levelId: string) => void;
  onCreatePreview: (type: EditorItem) => void;
};

export const LevelEditorTools: React.FC<LevelEditorToolsProps> = ({
  onSave,
  onLoad,
  onCreatePreview,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();

  const handleTypeChange = (type: string) => {
    const newType = type as EditorItem;
    onCreatePreview(newType);
  };

  return (
    <>
      <EditorToolsWrapper>
        <PlatformTypeSelector onChange={handleTypeChange} />
        <CollectablesSelector onChange={handleTypeChange} />
      </EditorToolsWrapper>
      <EditorPanel>
        <Button onClick={() => setIsModalOpen(true)} $variant="secondary">
          {t("editor.menu")}
        </Button>
      </EditorPanel>
      <LevelSelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onSave}
        onLoad={onLoad}
      />
    </>
  );
};
