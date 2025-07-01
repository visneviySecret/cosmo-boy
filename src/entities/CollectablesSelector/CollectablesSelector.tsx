import React from "react";
import { BaseSelector } from "../../shared/ui/BaseSelector/BaseSelector";
import { CollectablesIcon } from "./CollectablesIcon";
import { useStore } from "../../shared/store";
import { EditorItem } from "../../shared/types/editor";
import { useTranslation } from "react-i18next";

export const CollectablesType = {
  Food_1: EditorItem.FOOD_1,
  Food_5: EditorItem.FOOD_5,
  Browny: EditorItem.BROWNY,
} as const;

export const CollectablesTypeLabel = {
  Food_1: "editor.collectables.food1",
  Food_5: "editor.collectables.food5",
  Browny: "editor.collectables.browny",
} as const;

type CollectablesType =
  (typeof CollectablesType)[keyof typeof CollectablesType];

interface CollectablesSelectorProps {
  onChange: (value: string) => void;
}

export const CollectablesSelector: React.FC<CollectablesSelectorProps> = ({
  onChange,
}) => {
  const { editorItem } = useStore();
  const { t } = useTranslation();

  // Создаем опции с переводами
  const options = Object.entries(CollectablesType).map(([key, value]) => ({
    value,
    label: t(CollectablesTypeLabel[key as keyof typeof CollectablesTypeLabel]),
  }));

  const handleChange = (value: string) => {
    onChange(value);
  };

  return (
    <BaseSelector
      options={options}
      value={editorItem || undefined}
      onChange={handleChange}
      placeholder={t("editor.collectables.selectItem")}
      icon={<CollectablesIcon />}
    />
  );
};
