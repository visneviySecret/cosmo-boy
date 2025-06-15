import React from "react";
import { EditorContainer, EditorCanvas } from "./LevelEditor.styled";
import { LevelEditorTools } from "./LevelEditorTools";
import { useLevelEditor } from "../hooks/useLevelEditor";

const LevelEditor: React.FC = () => {
  const { phaserRef, saveLevel, loadLevel, createPreview } = useLevelEditor();

  return (
    <EditorContainer>
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
