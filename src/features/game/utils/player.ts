export const getCurrentTexture = (level: number): string => {
  return `player_phase_${level}`;
};

export const calculateTextureScale = (level: number): number => {
  switch (level) {
    case 1:
      return 0.9;
    case 2:
      return 0.7;
    case 3:
      return 1;
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

export const getExperienceToNextLevel = (level: number): number => {
  switch (level) {
    case 5:
      return 6;
    default:
      return 9;
  }
};

export const getOffset = (level: number, size: number): [number, number] => {
  switch (level) {
    case 1:
      return [size, size * 2];
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
    frameHeight: 218,
  },
  {
    frameWidth: 258,
    frameHeight: 232,
  },
  {
    frameWidth: 184,
    frameHeight: 280,
  },
  {
    frameWidth: 184,
    frameHeight: 312,
  },
];
