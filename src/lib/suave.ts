export const limita = (x: number, min: number, max: number) => Math.min(max, Math.max(min, x));

// Curva cúbica (smoothstep): 0 antes de a, 1 depois de b.
export const suave = (a: number, b: number, x: number) => {
  const t = limita((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
