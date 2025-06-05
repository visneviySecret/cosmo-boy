import React from "react";
import { Button } from "../../../shared";
import { EditorPanel, EditorToolsWrapper } from "./LevelEditor.styled";
import { useStore } from "../../../shared/store";
import { EditorItem } from "../../../shared/types/editor";
import { PlatformTypeSelector } from "../../../entities";

type LevelEditorToolsProps = {
  onSave: () => void;
  onLoad: () => void;
};

export const LevelEditorTools: React.FC<LevelEditorToolsProps> = ({
  onSave,
  onLoad,
}) => {
  const { editorItem, setEditorItem } = useStore();

  return (
    <>
      <EditorToolsWrapper>
        <PlatformTypeSelector
          value={editorItem}
          onChange={(type) => setEditorItem(type as EditorItem)}
        />
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
