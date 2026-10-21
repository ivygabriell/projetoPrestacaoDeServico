'use client';

import { UseCanvas } from '@14islands/r3f-scroll-rig';
import { useEffect, useState } from 'react';
import { ehCelular, prefereMenosMovimento } from '@/lib/ambiente';
import { temWebgl } from '@/lib/webgl';
import { CenaPassagem } from './CenaPassagem';

// No celular, com movimento reduzido ou sem WebGL não há plano: as seções escuras pintam o próprio fundo (classe no <html>).
export function Passagem() {
  const [usarPlano, setUsarPlano] = useState(false);
  useEffect(() => {
    const plano = !ehCelular(window.innerWidth) && !prefereMenosMovimento() && temWebgl();
    document.documentElement.classList.toggle('fundo-por-secao', !plano);
    setUsarPlano(plano);
  }, []);
  if (!usarPlano) return null;
  return (
    <UseCanvas>
      <CenaPassagem />
    </UseCanvas>
  );
}
