export const getCurrentTexture = (level: number): string => {
  const phase = level > frameSizes.length ? frameSizes.length : level;
  return `player_phase_${phase}`;
};

export const calculateTextureScale = (level: number): number => {
  switch (level) {
    case 1:
      return 0.9;
    default:
      return 1;
  }
};

export const textureResize = (
  level: number
): { width: number; height: number } => {
  const frameSize = getFrameSize(level);
  return { width: frameSize.frameWidth / 2, height: frameSize.frameHeight / 2 };
};

export const getExperienceToNextLevel = (): number => {
  return 9;
};

export const getOffset = (level: number, size: number): [number, number] => {
  switch (level) {
    case 2:
    case 6:
      return [size / 2, size / 2];
    case 1:
    case 3:
    case 4:
      return [size / 2, size];
    default:
      return [size, size];
  }
};

export const getFrameSize = (
  level: number
): { frameWidth: number; frameHeight: number } => {
  return frameSizes[level - 1];
};

export const frameSizes = [
  {
    frameWidth: 182,
    frameHeight: 220,
  },
  {
    frameWidth: 258,
    frameHeight: 232,
  },
  {
    frameWidth: 186,
    frameHeight: 282,
  },
  {
    frameWidth: 184,
    frameHeight: 312,
  },
  {
    frameWidth: 249,
    frameHeight: 352,
  },
  {
    frameWidth: 600,
    frameHeight: 286,
  },
];
