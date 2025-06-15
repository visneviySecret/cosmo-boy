import React from "react";
import { BaseSelector } from "../../shared/ui/BaseSelector/BaseSelector";
import { CollectablesIcon } from "./CollectablesIcon";
import { useStore } from "../../shared/store";
import { EditorItem } from "../../shared/types/editor";
import { optionsFromConstObject } from "../utils";

export const CollectablesType = {
  Food_1: EditorItem.FOOD_1,
  Food_5: EditorItem.FOOD_5,
} as const;

export const CollectablesTypeLabel = {
  Food_1: "Еда +1",
  Food_5: "Еда +5",
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
  const options = optionsFromConstObject(
    CollectablesType,
    CollectablesTypeLabel
  );

  const handleChange = (value: string) => {
    onChange(value);
  };

  return (
    <BaseSelector
      options={options}
      value={editorItem || undefined}
      onChange={handleChange}
      placeholder="Выберите предмет"
      icon={<CollectablesIcon />}
    />
  );
};
