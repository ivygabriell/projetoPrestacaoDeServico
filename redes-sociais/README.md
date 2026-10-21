# Identidade nas redes sociais

Rascunho v0.1 (2026-10-21). A mesma marca do site, traduzida para o Instagram e o LinkedIn. Desenho e critérios na [spec](../docs/superpowers/specs/2026-10-20-identidade-redes-sociais-design.md).

## Como ver e exportar

```bash
npm run redes            # abre o manual em http://localhost:3200 (com o perfil simulado)
npm run redes:exportar   # gera PNG de todas as peças e PDF dos carrosséis em redes-sociais/exportados/
npm run redes:exportar -- posts stories   # só alguns modelos
```

- `manual.html` é o guia visual: essência, paleta, tipografia, elementos, perfil simulado, carrosséis, posts, stories e tom de voz. Aberto direto do disco também funciona, mas o perfil simulado precisa do servidor.
- Cada arquivo em `modelos/` abre como uma prancha. Acrescente `?grade` ao endereço para ver as margens e as zonas seguras, e `?exportar` para ver as peças em tamanho real.
- Para criar uma peça nova, copie uma `<section class="peca" ...>` do modelo mais parecido, troque o `data-nome` (único no arquivo) e o texto. O formato vem do `data-formato`.
- A pasta `exportados/` não vai para o Git: é refeita pelo script.

## 1. Essência

No site, a prova é a própria experiência. No feed, cada peça precisa provar o mesmo em um segundo de rolagem. O perfil é um **laboratório aberto**, não um panfleto.

| Atributo | Como aparece |
|---|---|
| **Inovação** | ASCII gerado por código, panorama que emenda entre as lâminas, vidro que refrata, celular desenhado para mostrar detalhes de interface |
| **Premium** | Espaço vazio, tipografia gigante, a serifa itálica como assinatura, nenhuma cor sobrando |
| **Minimalista** | Uma ideia por peça; três fontes, cinco cores e uma moldura fixa |
| **Corporativo** | Tom sóbrio, sem gírias nem emojis; normas do CFO e da OAB respeitadas; dados só quando reais |

Público: quem decide a contratação de um site em imobiliárias, clínicas odontológicas e escritórios de advocacia.

## 2. Plataformas e formatos

| Formato | Tamanho | Onde |
|---|---|---|
| Retrato (`retrato`) | 1080×1350 | Feed e carrosséis no Instagram; posts e carrosséis (PDF) no LinkedIn |
| Story (`story`) | 1080×1920 | Stories e capas de reels. Zona segura: 250 px em cima, 340 px embaixo |
| Quadrado (`quadrado`) | 1080×1080 | Avatar e capas de destaque (recorte em círculo: conteúdo no centro) |
| Capa do LinkedIn (`linkedin`) | 1584×396 | Perfil. A foto cobre o canto inferior esquerdo: texto à direita |

## 3. Paleta

As mesmas cores do site. Proporção aproximada no feed:

| Cor | Hex | Uso nas redes | Proporção |
|---|---|---|---|
| Claro | `#F7F7F5` | Fundo padrão | 70% |
| Preto neutro | `#121212` | Texto; fundo das peças escuras | 20% |
| Cinza claro | `#DCDCD8` | Linhas, divisórias, área reservada a imagem | 6% |
| Cinza médio | `#787878` | Texto secundário **grande** e contornos (4,1 : 1 no claro: não usar em texto pequeno) | 2% |
| Azul profundo | `#002FA7` | Só detalhe no claro: ponto final, linha, botão, tracinho atual, campos a preencher | 2% |
| Azul no escuro | `#5B7BFF` | Os mesmos detalhes sobre o preto (proposta pendente, a mesma do site) | — |

- O azul **nunca é fundo** e nunca preenche um título inteiro.
- **Feed sem "pisca-pisca":** as peças escuras andam juntas, numa linha de três, nunca em xadrez. É a regra do site (um só trecho escuro) aplicada à grade.
- O preto esverdeado continua vetado: o preto é sempre o neutro `#121212`.

## 4. Tipografia

Todas gratuitas, no Google Fonts.

| Família | Papel | Na peça de 1080 px |
|---|---|---|
| **Inter Tight** 800 | Títulos em caixa-alta, tracking −0,055em, entrelinha 0,9 | 84 a 200 px |
| **Instrument Serif** itálico | Uma palavra por título, a que "respira" (*mostra*, *primeira consulta*) | 1,08× o título |
| **Azeret Mono** 400 | Moldura, rótulos e índices em caixa-alta, tracking −0,02em | 24 a 26 px |
| **Inter Tight** 400 | Texto corrido, no máximo 3 linhas | 30 a 36 px |

No celular a peça aparece a cerca de um terço do tamanho: nada abaixo de 24 px.

## 5. Moldura e grade

- Margem de 64 px em todos os lados.
- **Topo:** `©MARCA` à esquerda; à direita o índice `(03/08)` ou o rótulo da série `(Laboratório)`.
- **Base:** `@marca.lab` à esquerda; no carrossel, os tracinhos no centro e `Arraste →` à direita (na última, `Fim`).
- No carrossel em panorama, a moldura usa `mix-blend-mode: difference` e inverte sozinha sobre o claro e o escuro, como o cabeçalho do site.

## 6. Elementos gráficos

Todos vêm do site:

| Elemento | De onde vem | Regra |
|---|---|---|
| Ponto azul | Ponto final do logotipo | Fecha todo título |
| Parênteses | Rótulos "(Quem somos)" | Rótulos e índices em mono |
| Faixa | Faixas do hero | Tira branca de palavras; atravessa as lâminas |
| Vão | Manifesto com vãos | Espaço sublinhado em azul dentro do título |
| Contorno | Palavra que gira no cubo | Números e símbolos vazados, ao fundo |
| ASCII | Galeria com revelação em ASCII | Formas (cubo, esfera, toro) desenhadas por código |
| Vidro | Formas de vidro do hero | Na borda do texto, nunca em cima da leitura |
| Borda orgânica | Passagem para o escuro | Divide claro e escuro dentro da peça |
| Tracinhos | Barra de progresso dos capítulos | Um por lâmina, o atual em azul |
| Celular | Detalhes de interface | Para mostrar uma decisão de interface |

## 7. Pilares e estilo de post

| Pilar | Para quê | Peça | Do feed |
|---|---|---|---|
| Educativo por nicho | Mostrar que entendemos o negócio do cliente | Carrossel educativo | 35% |
| Prova | Cases e antes/depois **só com dados reais e autorizados** | Case, carrossel | 20% |
| Laboratório | Bastidores: estrutura, código, detalhes de interface | ASCII, detalhe | 20% |
| Manifesto | O ponto de vista da marca | Manifesto, panorama | 15% |
| Conversa | Perguntas e testes que geram resposta | Pergunta, enquete | 10% |

Regras de cada post: uma ideia; título de até 8 palavras com uma palavra em serifa; texto de apoio de até 3 linhas; nada de foto de banco. Fotos de projetos reais entram como capturas de tela dentro do celular ou da área reservada, sem filtro.

## 8. Carrosséis

- 5 a 10 lâminas. Capa com o gancho; uma ideia por lâmina; uma **virada** (a única lâmina escura); a última com a chamada.
- **Panorama** (`carrossel-manifesto.html`): a borda orgânica, a faixa e o vidro atravessam as lâminas. O desenho fica num `<template class="panorama-molde">` e o `pecas.js` o desloca em cada lâmina.
- **Educativo** (`carrossel-educativo.html`): problema em uma frase, explicação curta e "Como resolver" em azul; o número vazado ao fundo marca o passo. Uma série por nicho (odontologia, imobiliário, advocacia).
- No LinkedIn, o mesmo carrossel sobe como PDF (gerado pelo script).

## 9. Stories e movimento

Os stories e os reels reaproveitam as animações do site com as mesmas durações: palavras que piscam 5 vezes antes de firmar (0,1 s cada), logotipo com glitch que assenta em 1 s, faixas lentas, texto que se digita, transições de 0,3 s. Figurinhas do Instagram ficam nas áreas tracejadas dos modelos. Nada de efeitos prontos do aplicativo.

## 10. Tom de voz e legendas

**Sim:** frases curtas e afirmativas; falar do negócio do cliente (pacientes, imóveis, clientes do escritório); um verbo de ação na chamada; números só quando medidos e com a fonte; normas do CFO e da OAB.

**Não:** "incrível", "top", "imperdível"; emojis e exclamações; "somos apaixonados por..."; promessa de resultado ou preço no post; jargão sem explicação.

Estrutura da legenda: gancho (a capa em outras palavras) → o que a pessoa ganha → chamada → assinatura → 3 a 5 hashtags.

```text
O site da sua clínica trabalha ou só existe?

Separamos 5 sinais que fazem pacientes desistirem antes de ligar. Confira no seu site, de preferência pelo celular.

→ Salve para revisar com calma.
→ Mande para quem cuida do site da clínica.

©MARCA · laboratório de sites
#odontologia #marketingodontologico #sitesprofissionais
```

## 11. Perfil

- **Bio:** "©MARCA · Laboratório de sites / Sites para imobiliárias, clínicas odontológicas e escritórios de advocacia. / O próprio site é a prova." e o link.
- **Avatar:** o © com o ponto azul sobre o preto, provisório até o nome sair.
- **Destaques:** 01 Cases, 02 Processo, 03 Nichos, 04 Laboratório (em preto), 05 Contato.
- **Ritmo do feed:** blocos de 9 com uma linha escura no meio (claro, claro, claro / escuro, escuro, escuro / claro, claro, claro).

## 12. Calendário sugerido

| Dia | Feed | Stories |
|---|---|---|
| Segunda | Carrossel educativo (nicho da semana) | Bastidor |
| Quarta | Laboratório ou prova | Enquete |
| Sexta | Manifesto ou conversa | Novo post + chamada |

Os nichos se revezam por semana. No LinkedIn, os mesmos carrosséis em PDF, com legenda mais longa.

## 13. Pendências

- Nome da marca: `©MARCA` e `@marca.lab` são provisórios em todas as peças.
- Aprovar o azul no escuro `#5B7BFF` (mesma pendência do site).
- Reels animados: os modelos são estáticos; o movimento está descrito na seção 9.
- Escolher a primeira série educativa e o calendário real.
