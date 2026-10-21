'use client';

import { gsap } from 'gsap';
import { EasePack } from 'gsap/EasePack';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

// Registro único dos plugins usados pelas seções (os mesmos do RayRay: ScrollTrigger, TextPlugin e EasePack).
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, TextPlugin, EasePack);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger };
