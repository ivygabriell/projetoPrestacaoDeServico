import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Cabecalho } from '@/componentes/cabecalho/Cabecalho';
import { SeloLateral } from '@/componentes/cabecalho/SeloLateral';
import { cabecalho, selo } from '@/conteudo/identidade';

describe('Cabecalho', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 20, 13, 7, 5));
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('mostra o relógio REC e o atualiza a cada segundo', () => {
    render(<Cabecalho visivel />);
    expect(screen.getByText('REC ter13:07:05')).toBeTruthy();
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByText('REC ter13:07:06')).toBeTruthy();
  });

  it('tem o nome com o trecho que recolhe', () => {
    const { container } = render(<Cabecalho visivel />);
    expect(container.querySelector('.nome')?.textContent).toContain(cabecalho.nome);
    expect(container.querySelector('.nome .recolhe')?.textContent).toBe(cabecalho.recolhe);
  });

  it('tem cada item do menu em duas cópias, apontando para a seção', () => {
    const { container } = render(<Cabecalho visivel />);
    const itens = [...container.querySelectorAll('nav a')];
    expect(itens.map((a) => a.getAttribute('href'))).toEqual(cabecalho.menu.map((m) => m.alvo));
    itens.forEach((a, i) => {
      expect(a.querySelector('.menu-texto')?.textContent).toBe(cabecalho.menu[i].rotulo);
      expect(a.querySelector('.menu-texto2')?.textContent).toBe(cabecalho.menu[i].rotulo);
    });
  });

  it('fica escondido até a abertura terminar', () => {
    const { container } = render(<Cabecalho visivel={false} />);
    expect(container.querySelector('.cabecalho')?.classList.contains('visivel')).toBe(false);
  });
});

describe('SeloLateral', () => {
  it('mostra o selo do rascunho', () => {
    render(<SeloLateral />);
    expect(screen.getByText(selo)).toBeTruthy();
  });
});
