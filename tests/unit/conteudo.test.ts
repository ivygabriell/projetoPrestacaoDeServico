import { describe, expect, it } from 'vitest';
import * as c from '@/conteudo/identidade';

describe('conteúdo da identidade', () => {
  it('tem as quantidades da estrutura da referência', () => {
    expect(c.abertura).toHaveLength(3);
    expect(c.faixas).toHaveLength(2);
    c.faixas.forEach((f) => expect(f).toHaveLength(10));
    expect(c.manifesto.partes).toHaveLength(4); // 3 vãos entre 4 partes
    expect(c.capitulos).toHaveLength(7);
    expect(c.decisoes.itens).toHaveLength(11);
    expect(c.decisoes.frases).toHaveLength(2);
    expect(c.unico.paragrafos).toHaveLength(2);
  });

  it('mantém a paleta aprovada, nesta ordem', () => {
    expect(c.paleta.map((p) => p.hex)).toEqual(['#F7F7F5', '#DCDCD8', '#787878', '#121212', '#002FA7']);
  });

  it('usa MARCA no cubo e ©MARCA no cabeçalho enquanto o nome está em aberto', () => {
    expect(c.cubo.palavra).toBe('MARCA');
    expect(c.cabecalho.nome).toBe('©MARCA');
  });

  it('aponta o menu para seções que existem', () => {
    expect(c.cabecalho.menu.map((m) => m.alvo)).toEqual(['#capitulos', '#decisoes', '#contato']);
  });

  it('tem um tipo de cartaz diferente por capítulo', () => {
    expect(new Set(c.capitulos.map((k) => k.tipo)).size).toBe(7);
  });
});
