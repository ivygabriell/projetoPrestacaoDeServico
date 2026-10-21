// Todos os textos e dados da página de identidade (rascunho v0.1). Nada de dados pessoais aqui.

export const paleta = [
  { hex: '#F7F7F5', nome: 'Claro', uso: 'Fundo da abertura, do hero e do contato' },
  { hex: '#DCDCD8', nome: 'Cinza claro', uso: 'Linhas, divisórias e estados apagados' },
  { hex: '#787878', nome: 'Cinza médio', uso: 'Textos grandes de apoio e arestas' },
  { hex: '#121212', nome: 'Preto', uso: 'Texto principal e o trecho escuro' },
  { hex: '#002FA7', nome: 'Azul profundo', uso: 'Só detalhes: ponto, links, seleção' },
] as const;

export const cabecalho = {
  nome: '©MARCA',
  recolhe: 'laboratório de',
  fim: 'sites',
  menu: [
    { rotulo: 'Capítulos', alvo: '#capitulos' },
    { rotulo: 'Decisões', alvo: '#decisoes' },
    { rotulo: 'Contato', alvo: '#contato' },
  ],
} as const;

export const selo = 'Rascunho v0.1';

export const abertura = ['Design lógico, ', 'desenvolvimento criativo, ', 'laboratório de sites'] as const;

export const logotipo = 'IDENTIDADE';

export const faixas = [
  ['Design lógico', 'Desenvolvimento criativo', 'Sites', 'Laboratório', 'Planejamento', 'No Brasil', 'Imobiliário', 'Odontologia', '(01)', 'Advocacia'],
  ['Interfaces', 'Desenvolvimento web', 'Three.js', 'Movimento', 'Interação', 'Criatividade', 'Único', 'Identidade', '(02)', 'B2B'],
] as const;

export const intro =
  'Um laboratório de sites para imobiliárias, clínicas odontológicas e escritórios de advocacia. Unimos design, interação e tecnologia para que o visitante pense, de imediato: esses caras são bons.';

export const rolarParaBaixo = 'role para baixo';

export const manifesto = {
  rotulo: '(Quem somos)',
  partes: ['A marca não diz que faz', 'sites excelentes. O próprio site', 'mostra. Animação, inovação, tipografia e acabamento são a mensagem,', 'não enfeite.'],
} as const;

export const apoio =
  'A identidade é para empresas de três nichos: imobiliárias, clínicas odontológicas e escritórios de advocacia. A ousadia visual não é diluída para agradar o público mais conservador: é ela que mostra, em segundos, do que o laboratório é capaz.';

export const cubo = { palavra: 'MARCA', legenda: 'Interações que fazem a marca se mover' } as const;

export const unico = {
  rotulo: '(O que é único)',
  paragrafos: [
    'Uma marca monocromática, com o azul profundo só nos detalhes, tipografia gigante como imagem principal e movimento com propósito: cada animação mostra uma capacidade, nenhuma está ali de enfeite.',
    'Desempenho e acessibilidade fazem parte da identidade. Lentidão, travamento no celular ou um detalhe mal resolvido desmentem a mensagem, então a página precisa ser tão bem construída quanto parece.',
  ],
} as const;

export type TipoCartaz = 'paleta' | 'azul' | 'sans' | 'mono' | 'serif' | 'movimento' | 'contraste';

export const capitulosRotulo = '(Capítulos da identidade)';

export const capitulos: readonly { id: string; titulo: string; subtitulo: string; categoria: string; tipo: TipoCartaz }[] = [
  { id: 'paleta', titulo: 'Paleta', subtitulo: 'Outubro 2026', categoria: 'Cor', tipo: 'paleta' },
  { id: 'azul', titulo: 'Azul profundo', subtitulo: 'Outubro 2026', categoria: 'Cor de destaque', tipo: 'azul' },
  { id: 'inter-tight', titulo: 'Inter Tight', subtitulo: 'Outubro 2026', categoria: 'Títulos e manifesto', tipo: 'sans' },
  { id: 'azeret-mono', titulo: 'Azeret Mono', subtitulo: 'Outubro 2026', categoria: 'Rótulos e interface', tipo: 'mono' },
  { id: 'instrument-serif', titulo: 'Instrument Serif', subtitulo: 'Outubro 2026', categoria: 'Detalhes editoriais', tipo: 'serif' },
  { id: 'movimento', titulo: 'Movimento', subtitulo: 'Outubro 2026', categoria: 'Vidro, glitch e física', tipo: 'movimento' },
  { id: 'contraste', titulo: 'Contraste', subtitulo: 'Outubro 2026', categoria: 'Acessibilidade', tipo: 'contraste' },
];

export const decisoes = {
  rotulo: ['(Decisões', '& Registro)'],
  frases: [
    'Cada decisão da identidade foi tomada com a pessoa e registrada com data.',
    'Este é o rascunho v0.1: o que ainda falta está nas pendências do projeto.',
  ],
  itens: [
    'Monocromático',
    'Azul profundo #002FA7',
    'Preto neutro #121212',
    'Claro #F7F7F5',
    'Inter Tight',
    'Azeret Mono',
    'Instrument Serif',
    'Um só trecho escuro',
    'Rolagem suave',
    'Base: RayRay Lab',
    'Nome em aberto',
  ],
} as const;

export const contato =
  'Este é o rascunho da identidade de um laboratório de sites. Entender o desenvolvimento enquanto se desenha, e o desenho enquanto se desenvolve, é o que faz o visitante pensar em segundos: esses caras são bons.';

export const rodape = {
  titulo: 'Manual de identidade · v0.1',
  linhas: [
    { rotulo: 'paleta', valor: '#F7F7F5 #DCDCD8 #787878 #121212 #002FA7' },
    { rotulo: 'tipografia', valor: 'Inter Tight, Azeret Mono, Instrument Serif' },
    { rotulo: 'referência', valor: 'RayRay Lab' },
    { rotulo: 'nome', valor: 'a definir' },
  ],
  credito: '©2026 rascunho, ainda não decidido',
} as const;
