# Auditoria da referência: RayRay Lab

**Fase 1 do método (referências e contexto).** Data: 2026-10-20. Referência única do projeto a partir desta data (decisão da pessoa: refazer a identidade com o RayRay Lab como única base de estrutura, efeitos, seções e animações, mantendo a paleta).

**Endereço:** https://www.rayraylab.com/ (home). As páginas `/work` e `/contact` foram lidas só onde a home depende delas.

**Como foi medido:**

- `curl` da home, do CSS (1 arquivo) e dos 22 scripts do Next.js; scripts formatados com Prettier e lidos à mão (componentes, timelines do GSAP, shaders, física).
- Chrome automatizado (Playwright 1.56, Chrome 141) em 1440×900 e em 390×844 com toque: rede completa, globais, capturas a cada rolada com a roda (rolagem suave ativa) e amostragem da abertura a cada 200 ms.
- REA (`analyze_web_bundle` sobre uma sessão CDP local): 40 scripts analisados, impressões digitais de Next.js e React, extensões WebGL2 usadas pelo Three.js. Como manda o método (nucleo/04), o REA confirmou o que `curl` e o navegador já mostravam; não acrescentou achados novos.

**O que não entra no repositório:** código, shaders, imagens, vídeos, modelo 3D, fontes comerciais e textos do RayRay. Este documento registra **estrutura, comportamento e valores medidos**; tudo será reescrito com o conteúdo e os tokens da marca.

---

## 1. Pilha técnica

| Item | Valor | Fonte |
|---|---|---|
| Framework | Next.js **15.5** (App Router), uma página `/` com componentes cliente | `next={version:"15.5.x"}` no chunk 255; rotas `/_next/static/chunks/app/*` |
| UI | React **19** (canary 19.2 empacotado pelo Next) | Chunks 1329d575 e 4bd1b696; REA `react-runtime` |
| 3D | Three.js **r180**, WebGL2, **um único canvas global** | `THREE.REVISION`; REA: `EXT_color_buffer_float`, `KHR_parallel_shader_compile` |
| Ponte React↔3D | **@react-three/fiber** (`useFrame`, `useThree`) | `__r3f` e `R3F` no chunk 989 |
| Canvas e rolagem | **@14islands/r3f-scroll-rig**: `GlobalCanvas` (`flat`, câmera em z=600, near 0,01, far 10000), `UseCanvas` por cena, `SmoothScrollbar` (Lenis), `useScrollbar` para ler `scroll.y` dentro do quadro 3D | Id `#ScrollRig-canvas`; classes `js-has-global-canvas js-smooth-scrollbar-enabled` no `<html>`; string `r3f-scroll-rig` |
| Rolagem suave | Lenis **1.2.3** dentro do scroll-rig, `syncTouch: true`, `locked` até a abertura terminar; desligada abaixo de 900 px | `lenisVersion="1.2.3"`; props do `SmoothScrollbar` |
| Animação | **GSAP 3.12.7** + **ScrollTrigger** (9 gatilhos na home) + **TextPlugin** (texto que se digita) + **EasePack** (`expoScale`) | Chunks 580, 605, 870, c15bf2b0, 241 |
| Física | **cannon-es** (mundo com gravidade, 6 planos, 100 caixas) | `World`, `Body`, `Plane`, `Box`, `fixedStep` no chunk 3 |
| Auxiliares 3D | three-stdlib: `GLTFLoader` (modelo `introShape.glb`), `RoundedBoxGeometry`, `OrbitControls` | Chunks 3, 870 |
| Estado | zustand (`onceYn`: a abertura só toca uma vez por sessão) | Módulo 1446 |
| Estilo | SASS compilado num CSS único (467 regras), sem framework de utilitários | `541d4ed1f0961bd7.css` |
| Fontes | Azeret Mono, Helvetica Neue (55 Roman, Medium, Bold), PP Editorial New (regular e itálico), Pretendard (coreano) | Rede (`/fonts/*.woff2`) |
| Hospedagem | Vercel (Analytics) | `/_vercel/insights/script.js` |

## 2. Estrutura da página (ordem real)

```
header.header (fixo, mix-blend-mode: difference)
#ScrollRig-canvas (canvas global atrás de tudo)
main.contents_wrap
  #awwwards (selo vertical fixo à direita)
  .loading (abertura)
  .main.m1  hero: logotipo + vidro 3D + faixas + intro + "please scroll down" + .shape_deco
  .main.m2  "(Who we are)" manifesto + texto de apoio + .inter_section (cubo) + "(What's unique)"
  .main.m3  "(Featured work)" galeria horizontal de 7 projetos + barra de progresso (29 tracinhos)
  .main.m4  "(Awards & Recognition)" título com linha + texto digitado + lençol com a lista
  .main.main_contact  frase gigante + cubo com física + .deco_black (círculo)
  .contact_info (rodapé fixo em serifa, aparece no contato)
.page_mask (círculo de transição entre páginas)
```

Ritmo de cor: **claro** (abertura e hero) → **escuro** (do manifesto até os prêmios) → **claro** (contato). Uma só passagem para o escuro e uma só volta.

## 3. Achados por seção

### 3.1 Abertura (`.loading`), só no desktop

| Item | Como funciona | Valor | Fonte |
|---|---|---|---|
| Composição | Vídeo pequeno centralizado e, abaixo, uma linha mono com três trechos | Vídeo 300×158; texto 14px Azeret Mono, tracking −0,02em; `gap: 30px` | CSS `.loading` |
| Sequência do texto | Trecho 1 aparece; trechos 2 e 3 esperam o vídeo do 1º projeto carregar (`canplaythrough`) | Opacidade 0→1: 0,2 s; 0,2 s; 0,3 s com 0,1 s de atraso | Timeline em `IntroShape` |
| Saída | O vídeo achata na vertical e o texto some | `scaleY: 0` e `autoAlpha: 0`, 0,3 s, atraso 0,5 s, `power?.easeOut` | Idem |
| Depois | Libera a rolagem (`smoothScrollbar.start()`), esconde a abertura e toca a timeline do hero | `display: none` | Idem |
| Duração total medida | ≈ 5,4 s até `display: none` (inclui download do vídeo) | Amostragem a cada 200 ms | Playwright |
| Só uma vez | Se a abertura já tocou na sessão, pula direto para o hero | Estado `onceYn` | zustand |

### 3.2 Hero (`.main.m1`)

| Item | Como funciona | Valor | Fonte |
|---|---|---|---|
| Logotipo | Imagem do logotipo num plano 3D com shader: cada linha horizontal é deslocada por um valor aleatório e borrada na horizontal; o deslocamento e o borrão caem a zero conforme `uProgress` vai de 0 a 1 | Deslocamento máx. 6% da largura; borrão horizontal ×6; 1 s, `easeInOut`, começa em 1,2 s | Shader de `IntroLogo` |
| Vidro 3D | 3 formas de um GLB com **shader próprio de refração** (não é `MeshPhysicalMaterial`): a cena sem as formas é desenhada num render target e o vidro amostra essa textura com ondulação por ruído Perlin, borrão direcional, fresnel e brilho especular | Render target do tamanho da tela; 1 forma principal com borrão que segue o mouse (`blurXY = 5·mouse.x, 3·mouse.y`) | Shaders e `useFrame` de `IntroShape` |
| Entrada das formas | Sobem de baixo e giram até o lugar | Forma 1: 1,8 s `power1.inOut`; formas 2 e 3: 1,4 s (a 3ª com 0,5 s de atraso); giros de 0,15π e π/9 | Timeline do hero |
| Flutuação | Movimento senoidal contínuo + reação ao mouse | Amplitudes de 0,03 a 0,07 da unidade da cena, frequências 0,6 a 0,9 rad/s; mouse desloca até 0,1 da unidade e gira a forma principal | `useFrame` |
| Paralaxe | As formas e o logotipo andam com a rolagem em velocidades diferentes | Logotipo ×1,6; formas ×0,1, ×0,9 e ×0,4 do `scroll.y` | `useFrame` |
| Faixas | Duas faixas brancas de palavras em maiúsculas cruzando a tela no meio, em sentidos opostos | 11px, peso 500, tracking −0,01em; 9000px de largura; deslocam 6000px em **200 s**, lineares | CSS `band_move`/`band_move2` |
| Texto de intro | Texto mono centralizado sob as faixas; cada palavra **pisca** antes de firmar | 13px/14px Azeret Mono, 700px de largura; cada palavra: opacidade 0↔1 em 0,1 s repetida 5×, começando em 1,5 s + aleatório(0–1 s) | Timeline do hero |
| Cabeçalho e selo | Cabeçalho desce do topo; selo lateral aparece | Cabeçalho `y: −100 → 0`, 0,8 s a partir de 1 s; selo 1 s | Idem |
| Vidro em DOM | `.shape_deco`: um recorte em SVG com `backdrop-filter: blur` e fundo branco a 10% acompanha a forma 3 | Escala `unidade/685`; entra girando 45° | CSS e timeline |
| Saída na rolagem | Faixas e "please scroll down" somem, as formas crescem e giram, a opacidade do vidro cai | `scrub: 1`, do topo do hero +10px até +2 alturas de tela | ScrollTrigger |

### 3.3 Passagem do claro para o escuro

| Item | Como funciona | Valor | Fonte |
|---|---|---|---|
| Técnica | Um plano de tela cheia **atrás** do conteúdo, na cor escura, cuja transparência é uma varredura de baixo para cima com **borda orgânica** (ruído Perlin animado) | Borda: ruído ×0,2 em (x·6, y·3, tempo) | Shader do componente da passagem |
| Gatilho | Ligada à rolagem do hero | Começa em 60% da altura da tela e dura mais 60% (`scrub: 1`) | ScrollTrigger |
| Volta ao claro | No contato, um círculo escuro de 130vw (`.deco_black`) **encolhe até sumir**, revelando o claro | 1,5 s, curva `expoScale(3,1)` | Chunk 3 |

### 3.4 Manifesto (`.main.m2`)

| Item | Como funciona | Valor | Fonte |
|---|---|---|---|
| Rótulo | "(Who we are)" pequeno, centralizado acima do bloco | 18px, sem caixa-alta | CSS |
| Manifesto | Texto gigante em maiúsculas, **justificado**, peso 500, ocupando a largura | 3,7vw / 3,32vw, tracking −0,01em; padding superior 85vh | CSS `.main_copy` |
| Vãos que abrem | Três `span` vazios entre palavras ganham largura com a rolagem, empurrando o texto | Largura 0 → 3% da largura da tela; `scrub: 1`, do topo −50px por 200px | ScrollTrigger |
| Texto de apoio | Parágrafo em corpo de texto | 18px/25px, largura 1000px | CSS `.sub_copy` |

### 3.5 Cubo da marca (`.inter_section`)

| Item | Como funciona | Valor | Fonte |
|---|---|---|---|
| Face da frente | Fundo escuro com a palavra da marca em **contorno** (sem preenchimento, traço branco de 1px), repetida em 3 linhas × 7 cópias, cada cópia **girando no eixo X** com atrasos escalonados | 230px, peso 700; 12 s lineares infinitos; atrasos 2,4 / 4,8 / 7,2 / 9,6 s; perspectiva alternando 1000/600px | CSS `text_rotation` |
| Giro do cubo | Com a seção fixada, o bloco de 1000×600 gira −90° no eixo Y e mostra a face lateral | `pin`, `scrub: 1`, duração 0,8 tela | ScrollTrigger |
| Face lateral | Imagem desfocada ao fundo e **10 retângulos aninhados** de contorno branco que encolhem de 1200×800 até tamanhos fixos | Tamanhos 43×66 até 980×1430; `stagger: 0,01` | CSS e timeline |
| Mouse | Ao fim do giro (>87%), as palavras param e os retângulos passam a seguir o mouse, cada um com atraso maior | Duração 0,15 s × índice | Ouvinte `mousemove` |
| Texto "(What's unique)" | Rótulo à esquerda (−148px) e dois parágrafos | 18px/25px | CSS |

### 3.6 Trabalhos em destaque (`.main.m3`)

| Item | Como funciona | Valor | Fonte |
|---|---|---|---|
| Galeria | Seção fixada; a rolagem vertical move a fileira de cartões na horizontal | `pin`, `scrub: 1`, duração = largura extra − 500px | ScrollTrigger |
| Cartões | 7 cartões altos, cada um com data e serviços embaixo e o nome em cima | 50vh × 74vh; espaço entre cartões `(100vw − 150vh − 60px)/2` | CSS `.pr_items` |
| Imagem em ASCII | Cada imagem é desenhada num plano WebGL; antes da revelação ela vira uma **grade de caracteres** (`: * o & 8 @ #`, por luminância + ruído) sobre o fundo escuro; uma varredura de baixo para cima troca o ASCII pela imagem | Célula de 15px; varredura ligada ao progresso da seção | Shader dos cartões |
| Hover | Zoom de 10% e escurecimento de 30% no WebGL; um vídeo pequeno (250px) **abre na vertical** no centro do cartão | 0,4 s para entrar, 0,3 s para sair; vídeo `scaleY 0→1` em 0,3 s | Timeline e CSS |
| Barra de progresso | 29 tracinhos de 1px a cada 9px e uma barra com borda que cresce até 100%; os tracinhos apagam conforme a barra passa; no fim a barra gira 6° e some | 253×16px | CSS e `onUpdate` |
| Clique | Fecha o vídeo e as legendas e navega para `/work/n` | 0,5 s | Timeline |

### 3.7 Prêmios num lençol (`.main.m4`)

| Item | Como funciona | Valor | Fonte |
|---|---|---|---|
| Título | "(Awards" e "& Recognition)" separados por uma linha que **cresce** | Linha 0 → `calc(60vw + 200px)` | Timeline com `pin` |
| Texto | Duas frases que **se digitam** letra a letra | TextPlugin, 1,2 s cada, `stagger 0,5` | Timeline |
| Lençol | A lista numerada de prêmios é uma **imagem** aplicada num plano 3D (20×24 segmentos) cuja borda de baixo **ondula como tecido** (senos no eixo Z, mais fortes embaixo) e que sobe por trás de uma máscara conforme a rolagem | 60vw de largura; amplitude 18–24px; seção fixada por 1,2 altura do lençol | Shader e ScrollTrigger |
| Lista (no desenho) | Folha branca, linha tracejada em cima e embaixo, itens grandes com número sobrescrito entre parênteses | Itens 3,7vw/4,4vw, peso 500; números 14px; tracejado 2px | CSS `.awards_section`, `.ad_items` |

### 3.8 Contato (`.main.main_contact`) e rodapé

| Item | Como funciona | Valor | Fonte |
|---|---|---|---|
| Frase | Texto institucional gigante em maiúsculas, justificado, no topo | 3,1vw / 2,8vw, peso 500, tracking −0,02em | CSS `.contact_title` |
| Círculo | O círculo escuro encolhe e revela o claro | Ver 3.3 | Chunk 3 |
| Cubo com física | Arestas de um cubo em linhas finas e **100 caixas arredondadas escuras** que nascem no centro, levam um impulso aleatório e caem; a gravidade acompanha a câmera, então as caixas escorregam enquanto o cubo gira | Caixas de 0,05 (raio 0,4); cubo de 1; gravidade 10; atrito 0,1; restituição 0,9; 50 caixas no celular | cannon-es no chunk 3 |
| Câmera | OrbitControls com giro automático, amortecimento, sem zoom e sem arrastar; cursor "grab" ao passar | Velocidade 10; ângulo polar de 0,1π a 0,9π | Idem |
| Rodapé | E-mail grande e linha de dados em **serifa**; rótulos em itálico pequeno | E-mail 1,56vw; dados 1,46vw em caixa-alta; rótulos 1vw itálico | CSS `.contact_info` |

### 3.9 Elementos fixos

| Item | Como funciona | Valor | Fonte |
|---|---|---|---|
| Cabeçalho | Três blocos: relógio "REC" à esquerda, nome no centro, idioma e menu à direita; **inverte sozinho** sobre qualquer fundo com `mix-blend-mode: difference` | 15px Azeret Mono, caixa-alta, tracking −0,02em; topo 12px, laterais 30px | CSS `.header` |
| Relógio | "REC" + dia da semana abreviado + hora, atualizado a cada segundo | Formato `tue13:37:26` | Layout |
| Nome | "©RAYRAY [creative web] lab": o trecho do meio **recolhe** no hover | Largura 126px → 0 em 0,3 s | CSS `.hidden_t` |
| Menu | Cada item tem duas cópias; no hover a de cima gira para trás e a de baixo gira para frente | `rotateX(90°)` e `translateY(−10px)`, 0,3 s | CSS `.menu_text2` |
| Selo lateral | Selo vertical fixo na borda direita, a meia altura | 53×171px | `#awwwards` |
| Transição entre páginas | Um círculo de 130vw cresce do centro e cobre a tela antes de navegar | 0,6 s | `.page_mask` |
| Barra de rolagem | Escondida | `::-webkit-scrollbar { width: 0 }` | CSS |

## 4. Celular (390×844, com toque)

| O que muda | Detalhe |
|---|---|
| Sem abertura | A página começa direto no hero |
| Rolagem nativa | O `SmoothScrollbar` fica desligado abaixo de 900px |
| Hero | Uma só forma de vidro, maior; logotipo em versão própria para celular; sem o vidro em DOM |
| Passagem para o escuro | Não usa o plano com ruído; as seções já têm fundo escuro |
| Cubo da marca | Gira uma vez quando a seção entra (sem fixar) e a face lateral não segue o dedo |
| Trabalhos | Lista vertical de cartões com imagem própria, sem ASCII, sem vídeo de hover e sem barra de progresso |
| Lençol | Vira uma imagem estática da lista |
| Contato | Mantém o cubo com física (50 caixas) e o círculo que encolhe |
| Movimento reduzido | **Não há** tratamento de `prefers-reduced-motion` (lacuna que o nosso projeto vai cobrir) |

## 5. Mapa para o nosso projeto

| Do RayRay | Para a marca |
|---|---|
| `#f9f9f9` (claro) | `#F7F7F5` |
| `#121813` (escuro esverdeado) | `#121212` (preto neutro; a pessoa vetou o esverdeado) |
| `#787878` e cinzas de apoio | `#787878` e `#DCDCD8` |
| Sem acento | Azul profundo `#002FA7` só em detalhes; no fundo escuro, `#5B7BFF` (proposta ainda a aprovar) |
| Helvetica Neue (comercial) | Inter Tight (gratuita) |
| PP Editorial New (comercial) | Instrument Serif (gratuita) |
| Azeret Mono | Azeret Mono (a mesma, gratuita) |
| Logotipo, fotos, vídeos e modelo 3D | Feitos por nós: logotipo provisório desenhado em canvas, formas de vidro geradas por código, imagens dos cartões desenhadas em canvas com a própria identidade |
| Projetos e prêmios | Capítulos da identidade e lista de decisões |

## 6. Critérios de aceite propostos

Estes critérios vão para a spec (`docs/superpowers/specs/2026-10-20-identidade-rayray-design.md`), que é onde a pessoa os aprova.

1. A página segue a ordem do RayRay: abertura → hero → passagem para o escuro → manifesto → cubo → galeria horizontal → lençol → contato com cubo de física → rodapé, com as mesmas quantidades (2 faixas, 3 vãos, 7 cartões, 29 tracinhos, 10 retângulos, 100 caixas no desktop e 50 no celular).
2. Mesma pilha: Next.js 15.5 (App Router), React 19, Three.js r180, @react-three/fiber, @14islands/r3f-scroll-rig com Lenis, GSAP com ScrollTrigger e TextPlugin, cannon-es e three-stdlib.
3. Os tempos e curvas medidos acima, com tolerância de ±10%.
4. Uma só passagem para o escuro (borda orgânica) e uma só volta ao claro (círculo que encolhe).
5. Paleta só com os tokens da marca; o azul aparece apenas em detalhes.
6. Celular conforme a seção 4; sem rolagem horizontal em 390 e 1440 px.
7. `prefers-reduced-motion`: sem abertura, sem animações ligadas à rolagem e sem física, com todo o conteúdo visível.
8. Nada copiado do RayRay: nenhum código, shader, imagem, vídeo, modelo, fonte comercial ou texto.
