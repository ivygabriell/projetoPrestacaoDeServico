'use client';

import { selo } from '@/conteudo/identidade';
import { useAbertura } from '@/estado/abertura';

// Selo vertical fixo na borda direita, no lugar do selo de prêmio da referência.
export function SeloLateral() {
  const { terminou } = useAbertura();
  return (
    <aside className={`selo${terminou ? ' visivel' : ''}`}>
      <span>{selo}</span>
    </aside>
  );
}
