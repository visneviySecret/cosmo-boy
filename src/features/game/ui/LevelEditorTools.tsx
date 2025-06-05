import React from "react";
import { PlatformTypeSelector } from "../../../entities";
import { Button } from "../../../shared";
import { EditorPanel, EditorToolsWrapper } from "./LevelEditor.styled";

type LevelEditorToolsProps = {
  platformType: string;
  setPlatformType: (type: string) => void;
  onSave: () => void;
  onLoad: () => void;
};

export const LevelEditorTools: React.FC<LevelEditorToolsProps> = ({
  platformType,
  setPlatformType,
  onSave,
  onLoad,
}) => {
  return (
    <>
      <EditorToolsWrapper>
        <PlatformTypeSelector value={platformType} onChange={setPlatformType} />
      </EditorToolsWrapper>
      <EditorPanel>
        <Button onClick={onSave} variant="primary">
          Сохранить
        </Button>
        <Button onClick={onLoad} variant="secondary">
          Загрузить
        </Button>
      </EditorPanel>
    </>
  );
};
