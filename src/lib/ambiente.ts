// Mesmo corte do RayRay: abaixo de 900px a página troca para a versão de celular.
export const LIMITE_CELULAR = 900;

export const ehCelular = (largura: number) => largura < LIMITE_CELULAR;

export const prefereMenosMovimento = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
