import React from "react";
import { GroundIcon } from "./GroundIcon";
import { useStore } from "../../shared/store";
import { EditorItem } from "../../shared/types/editor";
import { BaseSelector } from "../../shared/ui/BaseSelector/BaseSelector";
import { useTranslation } from "react-i18next";

export const PlatformType = {
  Asteroid: EditorItem.ASTEROID,
  PutinWeb: EditorItem.PUTIN_WEB,
} as const;

export const PlatformTypeLabel = {
  Asteroid: "editor.platforms.asteroid",
  PutinWeb: "editor.platforms.putinWeb",
} as const;

type PlatformType = (typeof PlatformType)[keyof typeof PlatformType];

interface PlatformTypeSelectorProps {
  onChange: (value: string) => void;
}

const PlatformTypeSelector: React.FC<PlatformTypeSelectorProps> = ({
  onChange,
}) => {
  const { editorItem, setEditorItem } = useStore();
  const { t } = useTranslation();

  // Создаем опции с переводами
  const options = Object.entries(PlatformType).map(([key, value]) => ({
    value,
    label: t(PlatformTypeLabel[key as keyof typeof PlatformTypeLabel]),
  }));

  const handleChange = (type: string) => {
    setEditorItem(type as EditorItem);
    onChange(type);
  };

  return (
    <BaseSelector
      options={options}
      value={editorItem || undefined}
      onChange={handleChange}
      placeholder={t("editor.platforms.selectPlatform")}
      icon={<GroundIcon />}
    />
  );
};

export default PlatformTypeSelector;
