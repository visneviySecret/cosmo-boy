import React from "react";
import { Button } from "../../../shared";
import { EditorPanel, EditorToolsWrapper } from "./LevelEditor.styled";
import { useStore } from "../../../shared/store";
import { EditorItem } from "../../../shared/types/editor";

type LevelEditorToolsProps = {
  onSave: () => void;
  onLoad: () => void;
};

export const LevelEditorTools: React.FC<LevelEditorToolsProps> = ({
  onSave,
  onLoad,
}) => {
  const { setEditorItem } = useStore();

  return (
    <>
      <EditorToolsWrapper>
        <Button onClick={() => setEditorItem(EditorItem.ASTEROID)}>
          Астероид
        </Button>
        <Button onClick={() => setEditorItem(EditorItem.PLATFORM)}>
          Платформа
        </Button>
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
