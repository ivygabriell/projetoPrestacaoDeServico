# Estudo das referências

**Fase 1 do método (referências e contexto).** Data do estudo: 2026-10-19.

**O que a pessoa pediu:** as três primeiras referências são a base do site, escolhidas pelas **animações, pela inovação, pela tipografia e pelas paletas**. A quarta (Ovia) serve só para aproveitar partes. O site é a vitrine da própria empresa, e por isso precisa *provar* a capacidade de entregar um site excelente.

**Como foi medido:** o HTML, o CSS e o JavaScript foram baixados com `curl`. Depois, cada página foi aberta no Chrome automatizado (Playwright) em 1440×900, rolada com a roda do mouse para disparar a rolagem suave e as animações ligadas à rolagem, e capturada tela a tela. Na mesma passada foram lidos os estilos calculados (fontes, tamanhos, cores), as animações ativas (`document.getAnimations()`), as bibliotecas expostas no `window` e os recursos baixados. A passada no celular foi feita em 390×844, com toque.

**O que não entra no repositório:** as capturas e os arquivos baixados ficam fora daqui, porque são obra de terceiros e o repositório é público. Este documento registra **comportamento, estrutura e valores medidos**. Pelo método, nada de código, imagem, vídeo, fonte ou texto das referências é copiado. Tudo é reescrito com os tokens e o conteúdo da marca.

---

## 1. RayRay Lab (rayraylab.com)

Estúdio de uma pessoa só, em Seul. Ganhou o "Site of the Day" do Awwwards e lista dezenas de prêmios.

### Pilha técnica

| Item | Valor | Fonte |
|---|---|---|
| Framework | Next.js (App Router) | `/_next/static/chunks/app/*` |
| 3D | Three.js r180, WebGL2, um `<canvas>` de tela cheia | `window.THREE.REVISION`, inventário de canvas |
| Rolagem | Lenis (rolagem suave) | Classe `lenis` no `<html>` e bundle |
| Materiais | `MeshPhysicalMaterial` com `transmission` (vidro), `InstancedMesh`, shaders próprios com `uTime`, `uProgress`, `uResolution` e `blurXY` | Uniforms no bundle |
| Modelo 3D | `introShape.glb` (a forma de vidro da abertura) | Requisição `fetch` |
| Vídeo | Abertura em vídeo e um vídeo por projeto (7), todos em loop e autoplay | Inventário de `<video>` |

### Tipografia

| Papel | Família | Uso medido |
|---|---|---|
| Interface e detalhes | **Azeret Mono** (gratuita, Google Fonts) | Menu e rótulos em 15px, maiúsculas, tracking −0,3px; texto de apoio em 13px |
| Texto corrido | Helvetica Neue (Roman, Medium, Bold) e Pretendard Variable (coreano) | Parágrafos de 17–18px, entrelinha de 25px, tracking −0,36px |
| Manifesto | Helvetica Neue em maiúsculas, **justificada**, ocupando a largura toda | Blocos "RAYRAYLAB PURSUES UNIQUE INTERACTIONS…" |
| Rodapé | **PP Editorial New** (regular e itálico), serifada | Contato, endereço e créditos, com rótulos em itálico pequeno |

### Paleta

| Token | Valor | Onde |
|---|---|---|
| Fundo claro | `#f9f9f9` | Abertura e rodapé |
| Fundo escuro | `#121813` (preto esverdeado) | Seções do meio |
| Texto | `#121813` / `#ffffff` | Invertido conforme a seção |
| Cinzas de apoio | `#787878`, `#585858`, `#ded6cd` | Detalhes |
| Acento | **nenhum**. O site é 100% monocromático, e a cor vem só das fotos e dos vídeos dos projetos | — |

### Sequência da página e animações

| # | Seção | O que acontece | Como (medido ou inferido) |
|---|---|---|---|
| 1 | **Preloader** | Vídeo pequeno centralizado com o texto "Creative dev, web experience lab" em monoespaçada. Depois some e a tela fica vazia por um instante | Vídeo `main04_a.mp4`; transição de opacidade |
| 2 | **Hero** | Logotipo "RAYRAY" gigante com **distorção tipo glitch/scanline** (as linhas horizontais deslocam as letras), com formas 3D de vidro fosco por trás que refratam o logotipo | Shader com `transmission` em cima do GLB |
| 3 | Faixa de serviços | Duas linhas de palavras ("UXUI DESIGN", "THREEJS", "INTERACTION"…) correndo em sentidos opostos, bem devagar | CSS `band_move` / `band_move2`, **200s**, linear, infinito |
| 4 | Texto de intro | A frase aparece **letra por letra, embaralhada**, como uma digitação | Visto nas capturas: o texto aparece com lacunas que vão se preenchendo |
| 5 | Logo girando | Texto circular girando | CSS `text_rotation`, **12s**, linear |
| 6 | **Passagem do claro para o escuro** | O fundo muda de `#f9f9f9` para `#121813` ao rolar | Transição ligada à rolagem |
| 7 | Manifesto | Texto gigante, justificado, em maiúsculas | — |
| 8 | **"BRAND" em contorno 3D** | A palavra BRAND repetida em linhas de contorno, extrudada em perspectiva e empilhada | Texto em wireframe/SVG |
| 9 | **Imagem com desfoque de shader** | Retrato em preto e branco com desfoque direcional forte, como movimento | Shader com `blurXY` e `blurActive` |
| 10 | **Trabalhos em destaque** | Galeria horizontal de cartões altos. Primeiro os cartões aparecem como **ASCII/pontilhado** (a imagem vira uma grade de caracteres) e depois revelam o vídeo real | Shader `dither` (36 ocorrências no bundle) |
| 11 | **Prêmios num "lençol"** | A lista de prêmios fica sobre uma folha branca que **ondula e se deforma como tecido** ao rolar, com bordas onduladas e pontilhadas | Deformação de malha em WebGL |
| 12 | Rodapé | Texto institucional gigante. Por baixo, um **cubo em wireframe que gira, com ~100 esferas pretas dentro que caem com física** e se acomodam conforme o cubo gira | `InstancedMesh` com física e rotação contínua |

**Detalhes:** relógio ao vivo no topo ("REC MON 16:57:35"), seletor de idioma e um selo lateral fixo do Awwwards.

**O que inspirar:** a mistura de mono com serifa editorial, o monocromático rigoroso com a cor vinda só dos projetos, e o ASCII/pontilhado como transição de imagem. Também a deformação de tecido, o cubo com física no rodapé e o texto embaralhado.

---

## 2. The Shift (theshift.tokyo)

Coletivo criativo de Tóquio. É a referência mais **editorial** do grupo.

### Pilha técnica

| Item | Valor | Fonte |
|---|---|---|
| CMS | WordPress (tema próprio) | `/wp-content/themes/the-shift/` |
| Animação | **GSAP 3.2.4** | `window.gsap.version` |
| Transição entre páginas | **Barba.js** | `window.barba` |
| Reatividade | Alpine.js | `cdn.min.js` |
| WebGL | Um `<canvas>` fixo de tela cheia (1440×900) | Inventário de canvas |
| Vídeo | Cinco vídeos de projetos em loop | Inventário de `<video>` |
| Rolagem | **Virtual**: o `scrollY` fica em 0 e o conteúdo se move por `transform` | `scrollY` constante durante a rolagem |

### Tipografia

| Papel | Família | Uso medido |
|---|---|---|
| Display serifado | **Gallery** (serifa de alto contraste, fina, com ligaduras incomuns) | "EXPLORING", "OF TODAY", nomes dos projetos, a faixa de áreas |
| Display e texto sem serifa | **Everett** (pesos 100 e 400) | "THE SHIFT" no hero, textos e menus em 15px maiúsculas, tracking −0,15px |
| Apoio | Lausanne (150) | Detalhes |
| Japonês | YakuHanJP + Noto Sans JP | Versão em japonês |

**A assinatura tipográfica** é misturar, no mesmo título, uma linha em **serifa fina** com uma linha em **sem serifa forte**, com recuos diferentes ("EXPLORING / THE SHIFT / OF TODAY"). As letras do título têm entrelinha negativa (11,5px numa fonte de 15px de base, escalada).

### Paleta

| Token | Valor | Onde |
|---|---|---|
| Claro | `rgb(240,240,240)` (`#f0f0f0`) | Fundo das seções claras |
| Escuro | `rgb(20,20,20)` (`#141414`) | Fundo das seções escuras e texto |
| Cinzas | `#323232`, `#e6e6e6`, `#f5f5f5` | Linhas e apoio |
| **Acento único** | **`#fe4249`** (vermelho coral) | Só no cursor |
| Modo escuro | Variáveis trocam claro por escuro (`--col-black` / `--col-white` invertidas) | Botão "DARK MODE" no rodapé |

### Sequência da página e animações

| # | Seção | O que acontece | Como |
|---|---|---|---|
| 1 | Hero | Título em três linhas mistas, um texto curto à direita e o relógio de Tóquio ao vivo no canto | — |
| 2 | **Janela em arco** | Card com o **topo arredondado em arco**, no canto direito, mostrando vídeos de projetos em carrossel ("01/05"), com botão de seta | Vídeos em loop; troca com GSAP |
| 3 | **Cursor próprio** | Um **ponto vermelho `#fe4249`** substitui o cursor e segue o mouse com atraso suave. Ele aparece em todas as capturas | Elementos `.ui-cursor`, `.ui-cursor-body`, `.ui-cursor-text` |
| 4 | **Desfoque na rolagem** | Durante a rolagem, a página inteira **desfoca** e volta a ficar nítida quando para (visível nas capturas) | Filtro ligado à velocidade da rolagem virtual |
| 5 | Claro → escuro | "WHAT WE DO" num bloco escuro, frase em Everett leve e um **botão circular branco** "ABOUT US" | — |
| 6 | **Lista de projetos com imagem no hover** | Lista grande de nomes em Gallery ("FOCUS ON STRETCH PLEATS", "LEVEL OF DISTANCE"…), numerada (01)–(05), com recuos alternados. Ao passar o mouse, **a imagem ou o vídeo do projeto aparece sobre o texto** e acompanha o cursor | Canvas WebGL fixo; transições de 2s com `cubic-bezier(.22,1,.36,1)` |
| 7 | **Faixa de áreas** | Duas linhas gigantes em Gallery ("PRODUCE · DIRECTION · DESIGN" / "SPACE · EDUCATION · FOOD · MUSIC") correndo em **sentidos opostos** | CSS `marquee` e `marquee_backward`, **80s**, linear |
| 8 | Contato | "GET IN TOUCH" gigante em Everett, botão "BACK TO TOP" circular, Instagram e o botão de modo escuro | — |

**Curvas de animação usadas** (o CSS conta quantas vezes cada uma aparece): `cubic-bezier(.66,0,.34,1)` (40×, entra e sai suave), `cubic-bezier(.32,.94,.6,1)` (33×, saída rápida), `cubic-bezier(.22,1,.36,1)` (saída exponencial). As durações mais comuns são 1s, 0,3s, 0,6s e 0,8s, e as transições de imagem chegam a 2s.

**O que inspirar:** a mistura serifa fina + sem serifa forte num mesmo título, o acento único usado só no cursor, a lista com imagem no hover, as faixas em sentidos opostos, o arco como forma recorrente e o modo escuro.

---

## 3. path digital (pathdigital.de)

Agência alemã que faz sites B2B. É a referência mais próxima do **modelo de negócio** e a que mais organiza a página para **converter**.

### Pilha técnica

| Item | Valor | Fonte |
|---|---|---|
| Framework | **Astro** (ilhas), hospedado na Vercel | `/_astro/*`, `?dpl=` |
| Rolagem | **Lenis** com `wheelMultiplier` configurável; curvas `cubic-bezier(.22,…)` e `ease-out` de 420ms | Bundle `SiteLayout` |
| Efeitos | `backdrop-filter: blur(7–14px)` (vidro fosco), `mask-image` em gradiente (bordas do carrossel de logos) | CSS |
| Canvas | Um canvas 2D de 1440×652 no hero (fundo pontilhado animado) | Inventário de canvas |
| Animações CSS | `collage-crossfade` (28s, opacidade), `logo-story-in`, `video-backdrop-in/out`, `preparation-arrive`, `language-menu-in` | `@keyframes` |

### Tipografia

| Papel | Família | Uso medido |
|---|---|---|
| Títulos | **Season** (sans de proporções clássicas, peso 550) | h2 do hero em **68,6px / 78,9px**, tracking **−2,06px** (−3%); h2 de seção em **45,8px / 58px**, tracking −1,37px; h3 em 28px / 34px, tracking −0,84px |
| Variante serifada | SeasonMix (400) | Destaques |
| Texto e interface | **Diatype** (400/500) | Corpo em 16px / 26px; menus em 14px; rótulos em 12–13px |

**A assinatura tipográfica** são títulos em **duas cores**: a primeira linha em preto (ou branco) e a segunda em cinza ("Get more demos every month / *with a conversion-optimized website.*"; "Where your website / *needs to keep up*").

### Paleta

| Token | Valor |
|---|---|
| `--color-1000` | `#0d0d0d` (fundo escuro) |
| `--color-900` | `#121212` |
| `--color-800` | `#252727` |
| `--color-700` | `#4a4d4f` |
| `--color-600` | `#636769` |
| `--color-500` | `#7b8083` |
| `--color-400` | `#9a9d9f` |
| `--color-300` | `#b0b3b5` |
| `--color-250` | `#d4d4d4` |
| `--color-200` | `#e9e9e9` |
| `--color-100` | `#f5f5f5` (fundo claro) |
| Acento | **Azul elétrico** só em gradientes (onda azul que separa as seções escuras das claras) e em pequenos "+" ao lado dos logos |

É uma **escala de cinzas numerada de 100 a 1000**, um bom modelo de organização de tokens.

### Sequência da página e animações

| # | Seção | O que acontece |
|---|---|---|
| 1 | Hero escuro | Fundo com **grade de pontos** animada, título em duas cores, dois botões em pílula e carrossel de logos de clientes com as bordas esmaecidas |
| 2 | **Parede de projetos em perspectiva** | Dezenas de capturas de sites de clientes, inclinadas em 3D numa grade, que se movem com a rolagem |
| 3 | **Texto revelado pela rolagem** | "Your product keeps evolving. You win new customers… Your website needs to keep up." Cada linha passa de cinza a branco conforme se rola |
| 4 | **Onda azul** | Uma faixa em gradiente azul elétrico com a borda ondulada faz a passagem do fundo escuro para o claro |
| 5 | **Menu que vira pílula** | No topo o menu é transparente. Ao rolar, ele se contrai numa **pílula escura com vidro fosco** (`backdrop-filter`) |
| 6 | Três cartões | "01 · Offering / 02 · Trust / 03 · Execution" |
| 7 | **Estudos de caso empilhados** | Cartões grandes (texto + captura) que **se empilham** ao rolar, cada um parando sobre o anterior |
| 8 | **Processo com lista fixa** | À esquerda, uma lista fixa (01 Strategy, 02 Visual Design, 03 Development, 04 Ongoing Optimization) que destaca a etapa atual. À direita rolam a descrição, uma ilustração de interface em vidro azul e os entregáveis |
| 9 | Depoimentos em vídeo | Cartões com retrato, play e citação |
| 10 | CTA pessoal | "Your next step. Let's talk about it.", com foto do fundador e "30-minute call", mais logos de investidores dos clientes |
| 11 | Tabela comparativa | "Projeto avulso" contra "path digital", em 6 linhas |
| 12 | FAQ escuro | Acordeão com "+" |
| 13 | CTA final | Outra onda azul e "Ready for a website that grows with you?" |
| 14 | Rodapé | Cidade + **hora local**, "Ask AI about us" (atalhos para perguntar sobre a agência em assistentes de IA) e seletor de idioma |

**O que inspirar:** a **estrutura que vende** (promessa, prova, processo, depoimento, comparação, FAQ, CTA), o título em duas cores, a escala de cinzas numerada, o menu em pílula de vidro, os casos empilhados, o processo com lista fixa e a onda como transição de cor.

---

## 4. Ovia (ovia.agency), só partes

Estúdio francês. Usa fontes **gratuitas** e técnica simples, com resultado vibrante.

| Item | Valor |
|---|---|
| Técnica | HTML, CSS e JS sem framework; `IntersectionObserver` (limiares 0,08 e 0,4) para revelar seções |
| Fontes | **Bricolage Grotesque** 800 (títulos), **Archivo** 400/500 (texto), **Space Mono** (rótulos), todas do Google Fonts |
| Títulos | h1 em 136,8px / 128,6px com tracking **−6,2px (−4,5%)**; h2 de seção em 100–173px em maiúsculas |
| Paleta | Fundo creme `#faf8f3`, preto `#0e0e0e`, **laranja `#ff5a00`**, **lima `#c8ff00`**, azul `#2e2bff`, violeta `#6a2eff`, rosa, verde `#2aa400` |
| Curva padrão | `cubic-bezier(.16,1,.3,1)` em 800ms (cor, transform) |

**Partes aproveitáveis:**
- **A palavra que troca no título** ("On crée des sites qui *rapportent / marquent / convertissent / inspirent*"), com a largura animada (`width` em 700ms) e a cor trocando.
- **O "I" do logotipo que troca de cor** a cada visita ou ciclo.
- **Barra de progresso de leitura** colorida no topo.
- **Faixa (marquee)** preta com serviços e asteriscos lima (`slide`, 26s).
- **Contadores** ("40+ projetos, 5 anos, 100%").
- **Grade de serviços colorida**, com um cartão de cor forte por serviço.
- **CTA em bloco lima** gigante e **logotipo enorme** no rodapé.
- Menu que muda de cor conforme a seção que está por baixo.

---

## 5. Síntese: o que as referências têm em comum

1. **Tipografia como imagem principal.** Títulos de 70 a 170px com tracking negativo entre −3% e −4,5%.
2. **Mistura de famílias:** uma serifa editorial (Gallery, Editorial New, SeasonMix), uma sem serifa (Everett, Helvetica, Season, Diatype) e muitas vezes uma monoespaçada para rótulos (Azeret, Space Mono).
3. **Base monocromática**, com escala de cinzas de `#0d0d0d`–`#141414` a `#f0f0f0`–`#f9f9f9`, e **no máximo um acento** (vermelho no cursor, azul na onda), ou nenhum.
4. **Alternância claro/escuro** entre as seções, com uma transição marcante (onda, desfoque, troca de fundo pela rolagem).
5. **Rolagem suave** (Lenis ou rolagem virtual) como base de todas as animações.
6. **Movimento contínuo e lento:** faixas de 26s a 200s, relógios ao vivo e textos girando.
7. **Interações de cursor:** cursor próprio, imagem que segue o mouse e hover com revelação.
8. **WebGL pontual e com propósito:** vidro, pontilhado, tecido, física. Ele não aparece em toda a página.
9. **Detalhes de "estúdio vivo":** hora local, cidade, prêmios e modo escuro.

## 6. Riscos e cuidados para o nosso projeto

- **Fontes pagas:** Gallery, Everett, Lausanne, Editorial New, Season, Diatype e Helvetica Neue exigem licença. As alternativas gratuitas ficam para a fase de identidade.
- **Peso e desempenho:** o RayRay baixa 37 vídeos e ~1,8 MB de JavaScript. O cenário `site-estatico` exige metas de Lighthouse, então cada efeito pesado precisa justificar o custo e ter versão leve ou estática.
- **Acessibilidade:** respeitar `prefers-reduced-motion` (desligar a rolagem suave, o desfoque e os shaders), não depender só do hover (o toque não tem hover) e manter o contraste mínimo nos títulos em cinza.
- **Celular:** cursor próprio, hover e parte dos shaders não existem no toque. Veja a seção abaixo.
- **Direitos:** reproduzir comportamento e estrutura, nunca os arquivos. Os logos de clientes e os depoimentos da path digital são de terceiros, e no nosso site esses espaços vão ser preenchidos com conteúdo próprio.

## 7. Abertura da página, medida no tempo

Capturas a cada 300–500 ms a partir do carregamento, em 1440×900.

| Site | O que acontece | Tempo até o hero completo |
|---|---|---|
| RayRay | **Preloader** com um vídeo pequeno e uma frase que se **digita sozinha** ("Creative dev, logical design, web experience lab"). Depois a tela fica em branco, as formas de vidro aparecem desfocadas e entram em foco, e por fim surge o logotipo com glitch | **~4 s** (preloader ~2 s, vazio ~1,5 s, entrada ~0,5 s) |
| The Shift | Tela vazia e, em seguida, cada linha do título **sobe por trás de uma máscara** (o texto nasce cortado embaixo e desliza para cima), uma linha depois da outra. Junto entra o card em arco | **~2,5 s** (vazio ~1,4 s, revelação ~0,7 s) |
| path digital | **Sem abertura.** O conteúdo já está lá no primeiro quadro e só o carrossel de logos começa a andar | **imediato** |
| Ovia | Sem preloader. A palavra destacada do título **troca a cada ~2,7 s** (letras caindo por uma máscara), e a cor da palavra e o brilho de fundo mudam juntos (azul, depois rosa…) | **imediato** |

**Leitura:** os estúdios autorais (RayRay, The Shift) usam a abertura como espetáculo. A agência que vende (path digital) prioriza o conteúdo imediato. Uma abertura curta, de até ~1,5 s e que não bloqueie, é o meio-termo a decidir no desenho.

## 8. No celular (390×844, toque)

| Site | O que muda |
|---|---|
| RayRay | O hero com glitch e vidro **continua** (logotipo menor). A galeria horizontal de trabalhos vira uma **pilha vertical**. O manifesto continua justificado. O cubo com física do rodapé **continua** |
| The Shift | Título em três linhas recuadas, mantido. O card em arco fica centralizado. A **lista de projetos perde a imagem no hover** e vira uma lista centralizada. O cursor próprio some. As faixas em sentidos opostos continuam |
| path digital | Menu vira **hambúrguer + pílula "Book a call" sempre visível**. A parede de projetos em perspectiva e o texto revelado pela rolagem continuam. Os casos deixam de se empilhar e viram cartões em sequência, com métricas ("2x Demo requests") |
| Ovia | Hambúrguer, palavra que troca mantida e grade de serviços em uma coluna. O **menu assume a cor da seção** que está por baixo |

**Leitura:** o que depende de cursor (hover com imagem, cursor próprio) é trocado por uma versão estática. O WebGL leve continua no celular. O CTA principal fica fixo.
