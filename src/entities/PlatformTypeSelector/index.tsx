import React from "react";
import styled from "styled-components";

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
  return (
    <Selector value={value} onChange={(e) => onChange(e.target.value)}>
      <option value={PlatformType.Asteroid}>Астероид</option>
    </Selector>
  );
};

const Selector = styled.select`
  font-size: 1.2rem;
  border-radius: 8px;
  padding: 1em 1em;
`;

export default PlatformTypeSelector;
