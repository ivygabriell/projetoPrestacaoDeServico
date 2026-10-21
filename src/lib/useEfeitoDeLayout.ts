import { useEffect, useLayoutEffect } from 'react';

// As timelines com pin precisam ser desfeitas antes de o React remover o DOM (o GSAP envolve a seção
// num pin-spacer); por isso rodam em useLayoutEffect, que no servidor vira useEffect.
export const useEfeitoDeLayout = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
