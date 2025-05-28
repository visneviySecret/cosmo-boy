export const GRAVITY_CONSTANT = 6.6743 * 50;
export const DEFAULT_MIN_DISTANCE = 50;

export interface GravityConfig {
  gravityConstant: number;
  minDistance: number;
}

export const createGravityConfig = (
  minDistance: number = DEFAULT_MIN_DISTANCE
): GravityConfig => ({
  gravityConstant: GRAVITY_CONSTANT,
  minDistance,
});

export interface GravityForce {
  force: number;
  normalizedDx: number;
  normalizedDy: number;
}

export const calculateGravityForce = (
  sourceX: number,
  sourceY: number,
  sourceMass: number,
  targetX: number,
  targetY: number,
  targetMass: number,
  minDistance: number
): GravityForce => {
  const dx = sourceX - targetX;
  const dy = sourceY - targetY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Используем минимальное расстояние для более равномерного притяжения
  const effectiveDistance = Math.max(distance, minDistance);

  // Расчет силы притяжения по закону всемирного тяготения
  const force =
    (GRAVITY_CONSTANT * sourceMass * targetMass) /
    (effectiveDistance * effectiveDistance);

  // Нормализуем вектор направления
  const normalizedDx = dx / distance;
  const normalizedDy = dy / distance;

  return {
    force,
    normalizedDx,
    normalizedDy,
  };
};
