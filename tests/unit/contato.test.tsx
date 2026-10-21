import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Contato } from '@/componentes/contato/Contato';
import { Rodape } from '@/componentes/contato/Rodape';
import { contato, rodape } from '@/conteudo/identidade';

afterEach(cleanup);

describe('Contato', () => {
  it('tem a frase gigante e o círculo escuro', () => {
    const { container } = render(<Contato />);
    expect(container.querySelector('.secao-contato')?.id).toBe('contato');
    expect(container.querySelector('.frase-contato')?.textContent).toBe(contato);
    expect(container.querySelector('.circulo-escuro')).toBeTruthy();
  });
});

describe('Rodape', () => {
  it('tem o título, as 4 linhas com rótulo em itálico e o crédito', () => {
    const { container } = render(<Rodape />);
    expect(container.textContent).toContain(rodape.titulo);
    const rotulos = [...container.querySelectorAll('.rodape-linha i')].map((i) => i.textContent);
    expect(rotulos).toEqual(rodape.linhas.map((l) => l.rotulo));
    rodape.linhas.forEach((l) => expect(container.textContent).toContain(l.valor));
    expect(container.textContent).toContain(rodape.credito);
  });
});
