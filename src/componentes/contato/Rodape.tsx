import { rodape } from '@/conteudo/identidade';

// Rodapé em serifa, fixo embaixo e visível só durante o contato (a classe "visivel" vem da timeline).
export function Rodape() {
  return (
    <footer className="rodape">
      <p className="rodape-titulo">{rodape.titulo}</p>
      <div className="rodape-linhas">
        {rodape.linhas.map((l) => (
          <p key={l.rotulo} className="rodape-linha">
            <i>{l.rotulo}</i> <span>{l.valor}</span>
          </p>
        ))}
        <p className="rodape-linha">{rodape.credito}</p>
      </div>
    </footer>
  );
}
