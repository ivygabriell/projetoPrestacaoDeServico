'use client';

import { SmoothScrollbar } from '@14islands/r3f-scroll-rig';
import { useEffect, useState } from 'react';
import { ScrollTrigger } from '@/gsap';
import { useAbertura } from '@/estado/abertura';
import { ehCelular, prefereMenosMovimento } from '@/lib/ambiente';

// Lenis com os valores padrão (rolagem lenta e limpa). Desligado no celular e para quem pede menos movimento.
export function Rolagem() {
  const { terminou } = useAbertura();
  const [ligada, setLigada] = useState(false);

  useEffect(() => {
    setLigada(!ehCelular(window.innerWidth) && !prefereMenosMovimento());
  }, []);

  return (
    <SmoothScrollbar enabled={ligada} locked={!terminou} scrollRestoration="manual" config={{ syncTouch: true }} onScroll={() => ScrollTrigger.update()} />
  );
}
