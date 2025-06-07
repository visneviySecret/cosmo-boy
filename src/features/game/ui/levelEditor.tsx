import React from "react";
import { EditorContainer, EditorCanvas } from "./LevelEditor.styled";
import { LevelEditorTools } from "./LevelEditorTools";
import { useLevelEditor } from "../hooks/useLevelEditor";

const LevelEditor: React.FC = () => {
  const { phaserRef, saveLevel, loadLevel, createPreview } = useLevelEditor();

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <EditorContainer onContextMenu={handleContextMenu}>
      <LevelEditorTools
        onSave={saveLevel}
        onLoad={loadLevel}
        onCreatePreview={createPreview}
      />
      <EditorCanvas ref={phaserRef} />
    </EditorContainer>
  );
};

export default LevelEditor;
