import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { BarraProgresso } from '@/componentes/capitulos/BarraProgresso';
import { Capitulos } from '@/componentes/capitulos/Capitulos';
import { capitulos, capitulosRotulo } from '@/conteudo/identidade';

afterEach(cleanup);

describe('Capitulos', () => {
  it('tem o rótulo e os 7 cartões com título e subtítulo', () => {
    const { container } = render(<Capitulos />);
    expect(container.querySelector('.secao-capitulos')?.id).toBe('capitulos');
    expect(container.querySelector('h2.rotulo-capitulos')?.textContent).toBe(capitulosRotulo); // h2 antes dos h3 dos cartões
    const cartoes = [...container.querySelectorAll('.cartao')];
    expect(cartoes).toHaveLength(7);
    cartoes.forEach((c, i) => {
      expect(c.querySelector('.cartao-titulo')?.textContent).toBe(capitulos[i].titulo);
      expect(c.querySelector('.cartao-subtitulo')?.textContent).toContain(capitulos[i].subtitulo);
    });
  });

  it('cada cartão tem uma imagem com alt igual ao título, para quando não houver WebGL', () => {
    const { container } = render(<Capitulos />);
    const imagens = [...container.querySelectorAll('.cartao img')];
    expect(imagens.map((i) => i.getAttribute('alt'))).toEqual(capitulos.map((c) => c.titulo));
  });
});

describe('BarraProgresso', () => {
  it('tem 29 tracinhos a cada 9px e a barra ativa', () => {
    const { container } = render(<BarraProgresso />);
    const tracinhos = [...container.querySelectorAll<HTMLElement>('.tracinho')];
    expect(tracinhos).toHaveLength(29);
    tracinhos.forEach((t, i) => expect(t.style.left).toBe(`${9 * i}px`));
    expect(container.querySelector('.barra-ativa')).toBeTruthy();
  });
});
