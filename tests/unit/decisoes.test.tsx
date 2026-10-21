import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Decisoes } from '@/componentes/decisoes/Decisoes';
import { decisoes } from '@/conteudo/identidade';

afterEach(cleanup);

describe('Decisoes', () => {
  it('tem o título dividido por uma linha que vai crescer', () => {
    const { container } = render(<Decisoes />);
    const titulo = container.querySelector('.titulo-decisoes')!;
    const partes = [...titulo.children].map((e) => e.className);
    expect(partes).toEqual(['titulo-parte', 'linha', 'titulo-parte']);
    expect(titulo.textContent).toBe(decisoes.rotulo.join(''));
  });

  it('tem as duas frases que se digitam', () => {
    const { container } = render(<Decisoes />);
    const frases = [...container.querySelectorAll('.frase')];
    expect(frases.map((f) => f.textContent)).toEqual([...decisoes.frases]);
  });

  it('tem a lista das 11 decisões numeradas no DOM', () => {
    const { container } = render(<Decisoes />);
    const itens = [...container.querySelectorAll('.lista-decisoes li')];
    expect(itens).toHaveLength(11);
    expect(itens[0].textContent).toContain(decisoes.itens[0]);
    expect(itens[10].querySelector('sup')?.textContent).toBe('(11)');
  });
});
