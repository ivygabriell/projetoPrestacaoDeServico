'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

// Quando a abertura termina, a rolagem destrava, o cabeçalho desce e o hero começa a entrar.
type Estado = { terminou: boolean; terminar: () => void };

const Contexto = createContext<Estado>({ terminou: true, terminar: () => {} });

export function ProvedorAbertura({ children }: { children: ReactNode }) {
  const [terminou, setTerminou] = useState(false);
  return <Contexto.Provider value={{ terminou, terminar: () => setTerminou(true) }}>{children}</Contexto.Provider>;
}

export const useAbertura = () => useContext(Contexto);
