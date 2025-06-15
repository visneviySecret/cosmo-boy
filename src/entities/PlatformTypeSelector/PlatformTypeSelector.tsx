import React from "react";
import { GroundIcon } from "./GroundIcon";
import { useStore } from "../../shared/store";
import { EditorItem } from "../../shared/types/editor";
import { BaseSelector } from "../../shared/ui/BaseSelector/BaseSelector";
import { optionsFromConstObject } from "../utils";

export const PlatformType = {
  Asteroid: EditorItem.ASTEROID,
  PutinWeb: EditorItem.PUTIN_WEB,
} as const;

export const PlatformTypeLabel = {
  Asteroid: "Астероид",
  PutinWeb: "Паутина Путина",
} as const;

type PlatformType = (typeof PlatformType)[keyof typeof PlatformType];

interface PlatformTypeSelectorProps {
  onChange: (value: string) => void;
}

const PlatformTypeSelector: React.FC<PlatformTypeSelectorProps> = ({
  onChange,
}) => {
  const { editorItem, setEditorItem } = useStore();
  const options = optionsFromConstObject(PlatformType, PlatformTypeLabel);
  const handleChange = (type: string) => {
    setEditorItem(type as EditorItem);
    onChange(type);
  };

  return (
    <BaseSelector
      options={options}
      value={editorItem || undefined}
      onChange={handleChange}
      placeholder="Выберите платформу"
      icon={<GroundIcon />}
    />
  );
};

export default PlatformTypeSelector;
