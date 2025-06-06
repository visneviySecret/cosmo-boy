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

export const PlatformType = {
  Asteroid: "asteroid",
} as const;

type PlatformType = (typeof PlatformType)[keyof typeof PlatformType];

interface PlatformTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const PlatformTypeSelector: React.FC<PlatformTypeSelectorProps> = ({
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

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
          {value === PlatformType.Asteroid ? "Астероид" : "Выберите тип"}
        </Selector>
        {isOpen && (
          <OptionsList>
            <Option onClick={() => handleSelect(PlatformType.Asteroid)}>
              Астероид
            </Option>
          </OptionsList>
        )}
      </SelectWrapper>
    </Container>
  );
};

export default PlatformTypeSelector;
