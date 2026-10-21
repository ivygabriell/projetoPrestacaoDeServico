'use client';

import { useEffect, useState } from 'react';
import { cabecalho } from '@/conteudo/identidade';
import { useAbertura } from '@/estado/abertura';
import { relogio } from '@/lib/relogio';

// Relógio REC, nome com trecho que recolhe e menu com texto que gira. Inverte sozinho com mix-blend-mode.
export function Cabecalho({ visivel }: { visivel: boolean }) {
  const [agora, setAgora] = useState(() => relogio(new Date()));

  useEffect(() => {
    const id = setInterval(() => setAgora(relogio(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className={`cabecalho${visivel ? ' visivel' : ''}`} inert={!visivel}>
      <span className="relogio">
        <i aria-hidden="true" />
        <span suppressHydrationWarning>{agora}</span>
      </span>
      <a className="nome" href="#topo">
        <span>{cabecalho.nome}</span>
        <span className="recolhe">{cabecalho.recolhe}</span>
        <span>{cabecalho.fim}</span>
      </a>
      <nav aria-label="Seções">
        {cabecalho.menu.map((m) => (
          <a key={m.alvo} href={m.alvo}>
            <span className="menu-texto">{m.rotulo}</span>
            <span className="menu-texto2" aria-hidden="true">
              {m.rotulo}
            </span>
          </a>
        ))}
      </nav>
    </header>
  );
}

export function CabecalhoDaPagina() {
  const { terminou } = useAbertura();
  return <Cabecalho visivel={terminou} />;
}
