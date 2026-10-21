'use client';

import { gsap } from 'gsap';
import { EasePack } from 'gsap/EasePack';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

// Registro único dos plugins usados pelas seções (os mesmos da referência: ScrollTrigger, TextPlugin e EasePack).
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, TextPlugin, EasePack);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger };

// Ordem de cálculo dos gatilhos = ordem na página (maior primeiro). As seções criam as timelines em
// momentos diferentes (depois das fontes, da folha, dos cartazes); sem isso, um pin criado depois
// desloca a página e os gatilhos de baixo ficam com posições velhas.
export const PRIORIDADE = { hero: 6, manifesto: 5, capitulos: 4, decisoes: 3, contato: 2 } as const;

let pedido = 0;
export const recalcularGatilhos = () => {
  if (typeof window === 'undefined') return;
  cancelAnimationFrame(pedido);
  pedido = requestAnimationFrame(() => ScrollTrigger.refresh());
};
