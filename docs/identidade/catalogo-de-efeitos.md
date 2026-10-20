# Catálogo de efeitos

Todos os efeitos encontrados nas duas referências (RayRay Lab e path digital), guardados como pediu a pessoa em 2026-10-20. A escolha de quais entram no site ainda está pendente.

- **Protótipos funcionando:** os 47 efeitos têm uma demonstração em [catalogo-de-efeitos.html](catalogo-de-efeitos.html), refeita do zero com a paleta e as fontes da marca. É só abrir o arquivo no navegador.
- **Achados na verificação com REA (22 a 47):** apareceram na segunda passada, com o REA e a navegação pelas páginas internas.
- **Como a verificação foi feita:** análise dos pacotes JavaScript com o REA (`analyze_web_bundle`, `inspect_web_event_listeners`), leitura dos ganchos do código (classes, `data-*`, timelines de GSAP, shaders), testes de hover e clique no Chrome automatizado e passada pelas páginas internas (RayRay `/work` e `/contact`; path digital `/manifesto`, `/website-relaunch-agency`, `/case-studies`, `/case-studies/kickscale`, `/pricing`, `/strategy-call`).

**Regra:** reproduzir o comportamento, nunca copiar código, imagens, vídeos, fontes ou textos das referências.

## Primeira passada (01–21)

| # | Efeito | Origem | Onde aparece |
|---|---|---|---|
| 01 | Abertura com texto digitando, entrando do desfoque | RayRay | Preloader da home |
| 02 | Glitch com linhas de varredura no logotipo | RayRay | Hero (shader com `uLogoImage` e `uProgress`) |
| 03 | Formas de vidro em 3D refratando o texto | RayRay | Hero (`MeshPhysicalMaterial` com `transmission`, `introShape.glb`) |
| 04 | Faixas de serviços em sentidos opostos | RayRay | Abaixo do hero (`band_move`, 200 s) |
| 05 | Texto que se monta embaralhado | RayRay | Texto de introdução |
| 06 | Texto circular girando | RayRay | `text_rotation`, 12 s |
| 07 | Fundo que passa de claro a escuro na rolagem | RayRay | Passagem para a seção "Who we are" |
| 08 | Palavra em contorno empilhado (eco em 3D) | RayRay | "BRAND" na seção 2 |
| 09 | Imagem com desfoque de movimento | RayRay | Seção 2 (shader com `blurXY`) |
| 10 | Imagem que nasce em ASCII | RayRay | Cartões de "Featured work" (shader `dither`) |
| 11 | Galeria horizontal de projetos | RayRay | "Featured work" (rolagem vertical vira horizontal) |
| 12 | Lista num "lençol" que ondula | RayRay | "Awards & Recognition" |
| 13 | Física num cubo que gira | RayRay | Rodapé e `/contact` |
| 14 | Grade de pontos animada no fundo | path digital | Hero |
| 15 | Logos de clientes com as bordas esmaecidas | path digital | Hero (`mask-image` em gradiente) |
| 16 | Parede de projetos em perspectiva | path digital | `home-project-collage` (13 capas em colunas) |
| 17 | Texto revelado pela rolagem | path digital | `data-scroll-fill` (GSAP + ScrollTrigger) |
| 18 | Onda de luz azul entre seções | path digital | Passagens escuro → claro e chamada final |
| 19 | Menu que vira pílula de vidro | path digital | `.site-nav` com `backdrop-filter` |
| 20 | Estudos de caso que se empilham | path digital | `data-project-stack` |
| 21 | Processo com lista fixa | path digital | `data-process` com `data-step-indicator` |

## Achados na verificação com REA (22–47)

### RayRay Lab

| # | Efeito | Evidência |
|---|---|---|
| 22 | **Logotipo que distorce seguindo o mouse**: a intensidade do glitch muda conforme a posição do cursor | Capturas com o mouse no centro e nos cantos; ouvintes de `pointermove` |
| 23 | **A seção gira como um cubo e se desfaz em caixas**: na rolagem, o bloco "BRAND" gira 90° em 3D e 10 caixas encolhem da tela cheia até uma grade | Timeline GSAP: `.inter_section` com `rotateY: -90deg` e `.box_item` de 1200×800 até o tamanho final, com `stagger` |
| 24 | **Espaço que se abre no meio do texto**: um vão cresce entre as palavras conforme a rolagem | `.ani_t` com `width` animada por ScrollTrigger `scrub` |
| 25 | **Menu com texto que rola no hover**: duas cópias da palavra deslizam uma sobre a outra | `menu_text` + `menu_text2` |
| 26 | **Logotipo do cabeçalho que se recolhe**: "©RAYRAY CREATIVE WEB LAB" vira "©RAYRAYLAB" | `.hidden_t` no `.copyright` |
| 27 | **Prévia do site dentro do cartão do projeto**: um vídeo do site aparece sobre a foto do projeto ativo | `pr_video`, vídeos `pr_0X_video_s.mp4` |
| 28 | **Barra de progresso com tracinhos** sob a galeria | `scroll_process` com 29 `ing_bar` + `active_bar` |
| 29 | **Página de projetos em tela cheia**: um projeto por rolada, com nome em serifa, miniaturas e contador (01/07) | Navegação em `/work` |
| 30 | **Elementos fixos que invertem a cor conforme a seção** (cabeçalho e selo lateral) | `header white`, `js-color-bg` / `js-color-text` |
| 31 | **Relógio ao vivo no cabeçalho** ("REC TUE 13:37:26") | `header_time`, `current_time` |

### path digital

| # | Efeito | Evidência |
|---|---|---|
| 32 | **Logotipo que se desfaz em pontos no hover**: as letras viram caracteres em braille ("⠋⠋⠋") | `data-brand-dither`; captura em hover |
| 33 | **Menu da marca no clique direito do logo**: "Baixar logo em SVG" e "Copiar logo em SVG" | `data-brand-menu`, `data-brand-download`, `data-brand-copy` |
| 34 | **Logos de clientes que abrem um depoimento**: clicar no "+" abre um cartão com a citação e a pessoa | `data-logo-trigger` / `data-logo-story` (`popover`), `logo-story-in` |
| 35 | **Depoimento em vídeo numa janela** com o fundo escurecido e desfocado | `data-video-dialog`, `video-backdrop-in/out` |
| 36 | **Cartões que surgem na rolagem** | `data-reveal` |
| 37 | **Mega menu de serviços** | `.services-menu` |
| 38 | **Indicador deslizante no menu**: uma pílula escura passa por trás do item em foco | Visto nas páginas internas |
| 39 | **Abas com sublinhado azul deslizante** | `/pricing` (Blueprint / Transformation / Growth Partnership) |
| 40 | **Carrossel de depoimentos** com pontos e destaque | `data-testimonial-rail`, `.featured-testimonial-stage` |
| 41 | **Antes e depois lado a lado** (site antigo × site novo) | `/case-studies/kickscale` |
| 42 | **Índice lateral fixo que acompanha a leitura** | `.article-toc-items` em casos e blog |
| 43 | **Ilustração isométrica em linhas**: camadas empilhadas em wireframe, uma em azul | Hero de `/manifesto` |
| 44 | **Ilustrações de interface em vidro azul** (telas do processo) | `data-process-visual`, `.visual-scene`, `.glass` |
| 45 | **Hora local no rodapé e atalhos "Ask AI about us"** | `data-local-clock` |
| 46 | **Perguntas frequentes em acordeão animado** | `.faq-item` / `summary` |
| 47 | **Formulário de agendamento com estados** (enviando, sucesso, erro) | `data-form-states`, `/strategy-call` |

## Base técnica observada

- **RayRay Lab:** Next.js + React, Three.js r180 via react-three-fiber (eventos `onPointerMove`/`onPointerOver` nos objetos 3D), GSAP com ScrollTrigger e Lenis (`syncTouch`).
- **path digital:** Astro, Lenis, GSAP + ScrollTrigger carregado sob demanda (`scrollFill`), elementos `popover` nativos e muito CSS.
