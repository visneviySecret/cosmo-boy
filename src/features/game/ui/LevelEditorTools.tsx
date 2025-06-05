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
  const { editorItem, setEditorItem } = useStore();

  return (
    <>
      <EditorToolsWrapper>
        <Button
          onClick={() => setEditorItem(EditorItem.ASTEROID)}
          variant={editorItem === EditorItem.ASTEROID ? "primary" : "secondary"}
        >
          Астероид
        </Button>
        <Button
          onClick={() => setEditorItem(EditorItem.PLATFORM)}
          variant={editorItem === EditorItem.PLATFORM ? "primary" : "secondary"}
        >
          Платформа
        </Button>
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
