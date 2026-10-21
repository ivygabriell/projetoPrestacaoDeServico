'use client';

import { useEffect, useRef } from 'react';

// Prévia que abre no hover: o cartaz rola dentro de uma janela pequena, como a prévia de um site.
export function Previa({ cartaz, ativa }: { cartaz: HTMLCanvasElement | null; ativa: boolean }) {
  const tela = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = tela.current?.getContext('2d');
    if (!ctx || !cartaz || !ativa) return;
    let quadro = 0;
    const inicio = performance.now();
    const desenhar = (agora: number) => {
      const { width: l, height: a } = ctx.canvas;
      const altura = (cartaz.height * l) / cartaz.width;
      const t = ((agora - inicio) / 4000) % 1;
      const y = -(altura - a) * (0.5 - 0.5 * Math.cos(t * Math.PI * 2));
      ctx.drawImage(cartaz, 0, y, l, altura);
      quadro = requestAnimationFrame(desenhar);
    };
    quadro = requestAnimationFrame(desenhar);
    return () => cancelAnimationFrame(quadro);
  }, [cartaz, ativa]);

  return <canvas className="cartao-previa" ref={tela} width={250} height={140} aria-hidden="true" />;
}
