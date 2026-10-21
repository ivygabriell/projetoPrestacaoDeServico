import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { CuboMarca } from '@/componentes/manifesto/CuboMarca';
import { Manifesto } from '@/componentes/manifesto/Manifesto';
import { manifesto, unico } from '@/conteudo/identidade';

afterEach(cleanup);

describe('Manifesto', () => {
  it('tem o rótulo, as 4 partes do manifesto e 3 vãos entre elas', () => {
    const { container } = render(<Manifesto />);
    expect(container.querySelector('.secao-manifesto')?.classList.contains('trecho-escuro')).toBe(true);
    expect(container.querySelector('h2.rotulo-manifesto')?.textContent).toBe(manifesto.rotulo);
    const texto = container.querySelector('.manifesto-texto')!;
    expect(texto.querySelectorAll('.vao')).toHaveLength(3);
    manifesto.partes.forEach((p) => expect(texto.textContent).toContain(p));
  });

  it('traz o texto de "O que é único"', () => {
    const { container } = render(<Manifesto />);
    expect(container.textContent).toContain(unico.rotulo);
    unico.paragrafos.forEach((p) => expect(container.textContent).toContain(p));
  });
});

describe('CuboMarca', () => {
  it('tem 3 linhas × 7 palavras em contorno com MARCA', () => {
    const { container } = render(<CuboMarca />);
    const palavras = container.querySelectorAll('.cubo-frente .palavra-contorno');
    expect(palavras).toHaveLength(21);
    palavras.forEach((p) => expect(p.textContent).toBe('MARCA'));
  });

  it('tem a face lateral com 10 retângulos', () => {
    const { container } = render(<CuboMarca />);
    expect(container.querySelectorAll('.cubo-lado .caixa')).toHaveLength(10);
  });
});
