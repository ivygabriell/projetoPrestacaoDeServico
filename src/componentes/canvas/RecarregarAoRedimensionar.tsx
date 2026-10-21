'use client';

import { useEffect } from 'react';

// Cada seção monta para a largura que encontra (galeria ou lista, lençol ou folha estática, pins em pixels).
// Quando a largura muda, a página recarrega e remonta, como a referência faz. A altura é ignorada,
// para a barra de endereço do celular não disparar recargas.
export function RecarregarAoRedimensionar() {
  useEffect(() => {
    const largura = window.innerWidth;
    let espera = 0;
    const aoRedimensionar = () => {
      clearTimeout(espera);
      espera = window.setTimeout(() => {
        if (window.innerWidth !== largura) window.location.reload();
      }, 300);
    };
    window.addEventListener('resize', aoRedimensionar);
    return () => {
      clearTimeout(espera);
      window.removeEventListener('resize', aoRedimensionar);
    };
  }, []);
  return null;
}
