export interface ArcPoint {
  x: number;
  y: number;
}

export class ArcCalculator {
  private readonly curveHeight: number;

  constructor(curveHeight: number) {
    this.curveHeight = curveHeight;
  }

  calculateArcPoint(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    progress: number
  ): ArcPoint {
    const x = startX + (endX - startX) * progress;
    const y =
      startY +
      (endY - startY) * progress -
      this.curveHeight * Math.sin(progress * Math.PI);

    return { x, y };
  }

  calculateArcPoints(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    pointCount: number
  ): ArcPoint[] {
    const points: ArcPoint[] = [];

    for (let i = 0; i < pointCount; i++) {
      const progress = i / (pointCount - 1);
      points.push(this.calculateArcPoint(startX, startY, endX, endY, progress));
    }

    return points;
  }
}
