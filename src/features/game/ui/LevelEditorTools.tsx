import React, { useState } from "react";
import { Button } from "../../../shared";
import { EditorPanel, EditorToolsWrapper } from "./LevelEditor.styled";
import { useStore } from "../../../shared/store";
import { EditorItem } from "../../../shared/types/editor";
import { PlatformTypeSelector } from "../../../entities";
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
  const { setEditorItem } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTypeChange = (type: string) => {
    const newType = type as EditorItem;
    setEditorItem(newType);
    onCreatePreview(newType);
  };

  return (
    <>
      <EditorToolsWrapper>
        <PlatformTypeSelector onChange={handleTypeChange} />
      </EditorToolsWrapper>
      <EditorPanel>
        <Button onClick={() => setIsModalOpen(true)} $variant="secondary">
          Меню
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
