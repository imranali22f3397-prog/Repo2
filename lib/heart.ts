export interface HeartPoint {
  x: number;
  y: number;
}

export function heartPoints(n: number, cx: number, cy: number, width: number): HeartPoint[] {
  const points: HeartPoint[] = [];
  const scale = width / 32;

  for (let i = 0; i < n; i++) {
    const t = (i / n) * 2 * Math.PI;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

    points.push({
      x: cx + x * scale,
      y: cy + y * scale,
    });
  }

  return points;
}
