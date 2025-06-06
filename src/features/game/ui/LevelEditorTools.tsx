import React from "react";
import { Button } from "../../../shared";
import { EditorPanel, EditorToolsWrapper } from "./LevelEditor.styled";
import { useStore } from "../../../shared/store";
import { EditorItem } from "../../../shared/types/editor";
import { PlatformTypeSelector } from "../../../entities";

type LevelEditorToolsProps = {
  onSave: () => void;
  onLoad: () => void;
  onCreatePreview: (type: EditorItem) => void;
};

export const LevelEditorTools: React.FC<LevelEditorToolsProps> = ({
  onSave,
  onLoad,
  onCreatePreview,
}) => {
  const { editorItem, setEditorItem } = useStore();

  const handleTypeChange = (type: string) => {
    const newType = type as EditorItem;
    setEditorItem(newType);
    onCreatePreview(newType);
  };

  return (
    <>
      <EditorToolsWrapper>
        <PlatformTypeSelector value={editorItem} onChange={handleTypeChange} />
      </EditorToolsWrapper>
      <EditorPanel>
        <Button onClick={onSave} $variant="primary">
          Сохранить
        </Button>
        <Button onClick={onLoad} $variant="secondary">
          Загрузить
        </Button>
      </EditorPanel>
    </>
  );
};
