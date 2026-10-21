import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Hero } from '@/componentes/hero/Hero';
import { faixas, rolarParaBaixo } from '@/conteudo/identidade';

afterEach(cleanup);

describe('Hero', () => {
  it('tem duas faixas, cada uma com os 10 itens repetidos pelo menos 3 vezes', () => {
    const { container } = render(<Hero />);
    const linhas = [...container.querySelectorAll('.faixa')];
    expect(linhas).toHaveLength(2);
    linhas.forEach((linha, i) => {
      const textos = [...linha.querySelectorAll('.faixa-item')].map((e) => e.textContent);
      expect(textos.length).toBeGreaterThanOrEqual(30);
      expect(textos.slice(0, 10)).toEqual([...faixas[i]]);
    });
  });

  it('divide o texto de intro em palavras que piscam', () => {
    const { container } = render(<Hero />);
    expect(container.querySelectorAll('.intro .palavra-intro').length).toBeGreaterThanOrEqual(10);
  });

  it('convida a rolar e traz o logotipo como título acessível', () => {
    const { container } = render(<Hero />);
    expect(container.querySelector('.role-para-baixo')?.textContent).toBe(rolarParaBaixo);
    expect(container.querySelector('h1')?.textContent).toBe('IDENTIDADE.');
  });
});
