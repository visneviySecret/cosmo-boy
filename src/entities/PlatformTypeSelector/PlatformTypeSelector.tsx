import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  SelectWrapper,
  IconWrapper,
  Selector,
  OptionsList,
  Option,
} from "./PlatformTypeSelector.style";
import { GroundIcon } from "./GroundIcon";
import { useStore } from "../../shared/store";
import { EditorItem } from "../../shared/types/editor";

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

const options = Object.entries(PlatformType).map(([key, value]) => ({
  label: PlatformTypeLabel[key as keyof typeof PlatformTypeLabel],
  value,
}));

const PlatformTypeSelector: React.FC<PlatformTypeSelectorProps> = ({
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { editorItem, setEditorItem } = useStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (type: string) => {
    setEditorItem(type as EditorItem);
    onChange(type);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Container>
      <SelectWrapper ref={wrapperRef}>
        <IconWrapper>{GroundIcon}</IconWrapper>
        <Selector onClick={toggleDropdown}>
          {editorItem
            ? options.find((opt) => opt.value === editorItem)?.label
            : "Выберите тип"}
        </Selector>
        {isOpen && (
          <OptionsList>
            {options.map((option) => (
              <Option
                onClick={() => handleSelect(option.value)}
                key={option.value}
              >
                {option.label}
              </Option>
            ))}
          </OptionsList>
        )}
      </SelectWrapper>
    </Container>
  );
};

export default PlatformTypeSelector;
