import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  SelectWrapper,
  IconWrapper,
  Selector,
  OptionsList,
  Option,
} from "./BaseSelector.style";

export interface Option {
  label: string;
  value: string;
}

interface BaseSelectorProps {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
}

export const BaseSelector: React.FC<BaseSelectorProps> = ({
  options,
  value,
  onChange,
  placeholder = "Выберите значение",
  icon,
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

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Container>
      <SelectWrapper ref={wrapperRef}>
        {icon && <IconWrapper>{icon}</IconWrapper>}
        <Selector onClick={toggleDropdown}>
          {options.find((opt) => opt.value === value)?.label || placeholder}
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
