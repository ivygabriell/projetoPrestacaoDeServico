# Identidade da marca refeita sobre o RayRay Lab

Fase 2 do método (desenho e spec). Data: 2026-10-20. Classificação: **arquitetural** (refaz a identidade do zero e escolhe a stack do projeto).

## 1. Objetivo e restrições

- **Objetivo:** refazer a página de identidade da marca do zero, usando o **RayRay Lab como única base** de estrutura, seções, efeitos, animações e transições, e com **as mesmas tecnologias** que ele usa. A página mostra a identidade da empresa (laboratório de sites B2B para imobiliárias, clínicas odontológicas e escritórios de advocacia) e deve provocar, de imediato, a reação "esses caras são bons".
- **Restrições decididas pela pessoa:**
  - Manter a paleta: `#F7F7F5`, `#DCDCD8`, `#787878`, `#121212` (preto neutro; o esverdeado `#121813` está vetado) e o azul profundo `#002FA7` só em detalhes.
  - Somente o RayRay Lab como referência. A path digital, The Shift e Ovia saem.
  - Usar a stack do RayRay para a visualização ser real (WebGL, física e rolagem de verdade, não aproximações).
  - Uma só parte escura na página: depois dela, voltar ao claro (decisão de 2026-10-20, depois do efeito "pisca-pisca").
  - Rolagem lenta e limpa, como em ivygabriell.vercel.app (Lenis com os valores padrão).
  - Ainda é **rascunho**: fora dos buscadores (`noindex`).
- **Fora de escopo:**
  - Páginas internas (`/work/n`, `/contact`) e a transição de página com o círculo.
  - Seletor de idioma (a página é só em português).
  - Nome definitivo e logotipo final: a página usa a palavra **IDENTIDADE** como logotipo provisório e **©MARCA** no cabeçalho.
  - O site comercial da empresa: isto é a identidade, não o site.

## 2. Entendimento

- **O que a pessoa disse:** "refaça essa identidade mantendo a paleta de cores, mas explorando somente um site como base de estrutura, efeitos, seções, animações e etc, o rayraylab"; "estude a estrutura do site por completo, em que stacks ele foi feito"; "já utilize das tecnologias que o site foi feito"; "faça do zero, mas mantendo a paleta de cores"; "estruture um plano para montar a identidade e faça".
- **O que eu supus (para a pessoa corrigir):**
  - "Faça do zero" vale também para a tipografia. Fico com a família já aprovada (Inter Tight, Azeret Mono, Instrument Serif), porque ela é o equivalente gratuito exato das fontes do RayRay (Helvetica Neue → Inter Tight; Azeret Mono é a mesma; PP Editorial New → Instrument Serif).
  - O conteúdo dos "projetos" e dos "prêmios" do RayRay vira **capítulos da identidade** e **lista de decisões**.
  - Logotipo provisório: a palavra IDENTIDADE em Inter Tight 800, com o ponto final em azul.
  - "Apague o contexto desnecessário": os arquivos da identidade antiga só saem depois de a pessoa ver a lista e confirmar (regra do `CLAUDE.md`).

## 3. Referências

Auditoria completa, com valores e fontes, em [docs/referencias/rayraylab.md](../../referencias/rayraylab.md). Resumo:

- **Pilha:** Next.js 15.5 (App Router), React 19, Three.js r180, @react-three/fiber, @14islands/r3f-scroll-rig (canvas global e Lenis), GSAP 3.12 com ScrollTrigger, TextPlugin e EasePack, cannon-es, three-stdlib.
- **Sequência:** abertura → hero (logotipo com glitch e vidro 3D que refrata) → passagem para o escuro com borda orgânica → manifesto com vãos que abrem → cubo da marca → galeria horizontal com ASCII → lista num lençol que ondula → contato com cubo de física → rodapé em serifa.

## 4. Desenho

### 4.1 Abordagem

| Opção | Resultado | Decisão |
|---|---|---|
| **A. Mesma pilha do RayRay** (Next.js + R3F + scroll-rig + GSAP + cannon-es) | Efeitos reais (refração, ASCII em shader, tecido, física) e a mesma sensação de rolagem | **Escolhida**: é o pedido da pessoa |
| B. HTML único com Three.js por CDN | Mais simples de publicar, mas reescreve à mão o que o scroll-rig resolve (sincronizar DOM e WebGL) | Descartada |
| C. Astro + ilhas | Bom desempenho, mas foge da pilha da referência | Descartada |

### 4.2 Pilha e versões

Versões com mais de duas semanas de publicação, alinhadas ao RayRay:

| Pacote | Versão | Papel |
|---|---|---|
| next | 15.5.x | App Router, página estática |
| react / react-dom | 19.1.x | UI |
| three / @types/three | 0.180.0 | 3D (r180, igual à referência) |
| @react-three/fiber | 9.3.x | React ↔ Three |
| @react-three/drei | 10.7.x | Dependência do scroll-rig e `OrbitControls` |
| @14islands/r3f-scroll-rig | 8.15.x | `GlobalCanvas`, `UseCanvas`, `SmoothScrollbar` (Lenis) |
| gsap | 3.13.x | Timelines, ScrollTrigger, TextPlugin, EasePack (gratuitos desde a 3.13) |
| cannon-es | 0.20.x | Física do cubo |
| three-stdlib | 2.36.x | `RoundedBoxGeometry` |
| typescript | 5.9.x | Tipos |
| vitest + @testing-library/react + jsdom | 3.2 / 16.3 / 26.1 | Testes micro |
| @playwright/test | 1.56.x | Testes do build (macro) |
| eslint + eslint-config-next | 9 / 15.5 | Lint |

Fontes por `next/font/google` (baixadas no build e servidas pelo próprio site): Inter Tight (400, 500, 700, 800), Azeret Mono (400), Instrument Serif (400 normal e itálico).

### 4.3 Estrutura de arquivos

```
app/
  layout.tsx          metadados (noindex), fontes, <Cabecalho>, <SeloLateral>, <CanvasGlobal>
  page.tsx            ordem das seções
  globals.css         tokens, reset e estilos por seção (nomes de classe por seção, como no RayRay)
src/
  conteudo/identidade.ts   todos os textos e dados (paleta, faixas, capítulos, decisões)
  lib/                     funções puras testáveis: suave.ts, relogio.ts, contraste.ts, ambiente.ts
  texturas/                desenho em <canvas> 2D: logotipo, cartazes dos capítulos, folha de decisões, fundo desfocado
  shaders/                 GLSL escrito para este projeto (refração, glitch, passagem, ASCII, tecido)
  componentes/             uma pasta por seção (DOM + cena 3D quando houver)
  gsap.ts                  registro único dos plugins
tests/
  unit/                    Vitest (micro)
  e2e/                     Playwright sobre o build (macro)
```

### 4.4 Componentes e responsabilidades

| Componente | DOM | Cena 3D (via `UseCanvas`) | Comportamento (valores da auditoria) |
|---|---|---|---|
| `CanvasGlobal` | `GlobalCanvas` do scroll-rig | Câmera em z=600, `flat` | Um único canvas atrás de tudo |
| `Rolagem` | `SmoothScrollbar` | — | Lenis com valores padrão, `syncTouch`; travado até a abertura acabar; desligado abaixo de 900px e com movimento reduzido; avisa o ScrollTrigger a cada quadro |
| `Cabecalho` | Relógio REC, ©MARCA com trecho que recolhe, menu com texto que gira | — | `mix-blend-mode: difference`; relógio a cada 1 s; recolhe 126px→0 em 0,3 s; menu `rotateX(90°)` 0,3 s |
| `SeloLateral` | Selo vertical "RASCUNHO v0.1" | — | Fixo à direita, a meia altura; aparece em 1 s |
| `Abertura` | Caixa 300×158 com animação em canvas + 3 trechos mono | — | Trechos 0,2/0,2/0,3 s; saída `scaleY 0` e `autoAlpha 0` em 0,3 s com 0,5 s de atraso; uma vez por sessão (`sessionStorage`); só no desktop |
| `Hero` | Faixas, texto de intro, "role para baixo", vidro em DOM | Logotipo com glitch; 3 formas de vidro geradas por código com refração por render target | Faixas 200 s; palavras piscam 5× a partir de 1,5 s + aleatório; logotipo `uProgress` 0→1 em 1 s a partir de 1,2 s; formas sobem em 1,8/1,4/1,4 s; saída com `scrub: 1` por 2 telas |
| `PassagemEscura` | — | Plano de tela cheia atrás do conteúdo, `#121212`, varredura de baixo para cima com borda de ruído | Começa em 60% da tela dentro do hero e dura 60% da tela |
| `Manifesto` | "(Quem somos)", manifesto justificado com 3 vãos, texto de apoio | — | 3,7vw; vãos 0→3vw com `scrub` em 200px |
| `CuboMarca` | Bloco 1000×600 com face da frente (palavra em contorno girando) e face lateral (10 retângulos sobre fundo desfocado) | — | Gira −90° em Y com a seção fixada por 0,8 tela; retângulos encolhem de 1200×800 com `stagger 0,01`; depois de 87%, seguem o mouse |
| `Capitulos` | "(Capítulos da identidade)", 7 cartões, barra de progresso | Um plano por cartão com shader ASCII que revela o cartaz | Fixada; fileira anda `−(largura extra)`; 29 tracinhos; hover: zoom 10%, escurece 30%, prévia animada abre na vertical (0,3 s) |
| `Decisoes` | "(Decisões" ── "& Registro)", 2 frases digitadas | Lençol: folha de decisões desenhada em canvas num plano 20×24 que ondula embaixo e sobe | Linha 0→`calc(60vw + 200px)`; TextPlugin 1,2 s com `stagger 0,5`; seção fixada por 1,2 altura do lençol |
| `Contato` | Frase gigante justificada, círculo escuro | Arestas do cubo e 100 caixas arredondadas com cannon-es, `OrbitControls` com giro automático | Círculo encolhe em 1,5 s `expoScale(3,1)`; gravidade 10 segue a câmera; atrito 0,1; restituição 0,9; 50 caixas no celular |
| `Rodape` | Dados da identidade em Instrument Serif com rótulos em itálico | — | Fixo embaixo, visível só no contato |

### 4.5 Cor na página

- Claro (`#F7F7F5`) na abertura e no hero; **escuro (`#121212`) do manifesto até as decisões**; claro de novo no contato. Uma só ida e uma só volta.
- Cabeçalho: `#F7F7F5` com `difference`, invertendo sozinho.
- Azul `#002FA7` só em detalhes: ponto do relógio, ponto final do logotipo, ponto do favorito, sublinhado de links, seleção de texto, borda ativa da barra de progresso. No escuro, o azul de detalhe é `#5B7BFF` (proposta pendente de aprovação, marcada no código).
- Caixas da física: `#121212`; arestas do cubo: `#787878`.

### 4.6 Estados e alternativas

- **Carregando:** a abertura cobre a página no desktop até a cena estar pronta; no celular e com movimento reduzido não há abertura.
- **Movimento reduzido** (`prefers-reduced-motion: reduce`): sem abertura, sem rolagem suave, sem timelines de rolagem, sem física (as caixas ficam paradas no fundo do cubo), sem glitch; o conteúdo todo aparece no lugar final. É uma melhoria sobre o RayRay, que não trata esse caso.
- **Sem WebGL:** as seções DOM continuam legíveis; os cartazes dos capítulos e a folha de decisões aparecem como imagens comuns.
- **Celular (< 900px):** conforme a seção 4 da auditoria (sem abertura, uma forma de vidro, cubo gira uma vez sem fixar, capítulos em lista vertical sem ASCII, decisões como lista estática, cubo de física com 50 caixas).

## 5. Conteúdo

Todos os textos ficam em `src/conteudo/identidade.ts`, em português. **Não há dados fictícios de clientes**: os "trabalhos" são capítulos da própria identidade. Não há e-mail, telefone ou endereço: o rodapé mostra os dados da identidade.

- **Abertura:** "Design lógico," / "desenvolvimento criativo," / "laboratório de sites".
- **Faixa 1:** Design lógico · Desenvolvimento criativo · Sites · Laboratório · Planejamento · No Brasil · Imobiliário · Odontologia · (01) · Advocacia.
- **Faixa 2:** Interfaces · Desenvolvimento web · Three.js · Movimento · Interação · Criatividade · Único · Identidade · (02) · B2B.
- **Intro:** "Um laboratório de sites para imobiliárias, clínicas odontológicas e escritórios de advocacia. Unimos design, interação e tecnologia para que o visitante pense, de imediato: esses caras são bons."
- **Manifesto (Quem somos):** "A marca não diz que faz [vão] sites excelentes. O próprio site [vão] mostra. Animação, inovação, tipografia e acabamento são a mensagem, [vão] não enfeite."
- **Cubo:** palavra **MARCA** em contorno; na face lateral, "Interações que fazem a marca se mover".
- **O que é único:** dois parágrafos sobre os princípios (monocromático com azul nos detalhes; tipografia gigante; movimento com propósito; desempenho e acessibilidade fazem parte da identidade).
- **Capítulos (7):** Paleta; Azul profundo; Inter Tight; Azeret Mono; Instrument Serif; Movimento; Contraste. Cada um com subtítulo "Outubro 2026" + categoria e um cartaz desenhado em canvas com a própria identidade (cores e códigos, espécimes de tipo, contraste WCAG medido).
- **Decisões (11):** Monocromático; Azul profundo #002FA7; Preto neutro #121212; Claro #F7F7F5; Inter Tight; Azeret Mono; Instrument Serif; Um só trecho escuro; Rolagem suave; Base: RayRay Lab; Nome em aberto. Frases digitadas: "Cada decisão da identidade foi tomada com a pessoa e registrada com data." / "Este é o rascunho v0.1: o que ainda falta está nas pendências do projeto."
- **Contato:** "Este é o rascunho da identidade de um laboratório de sites. Entender o desenvolvimento enquanto se desenha, e o desenho enquanto se desenvolve, é o que faz o visitante pensar em segundos: esses caras são bons."
- **Rodapé:** "Manual de identidade · v0.1"; *paleta* #F7F7F5 #DCDCD8 #787878 #121212 #002FA7; *tipografia* Inter Tight, Azeret Mono, Instrument Serif; *referência* RayRay Lab; *nome* a definir; "©2026 rascunho, ainda não decidido".

## 6. Critérios de aceite

### Estrutura e conteúdo
- [ ] Ordem: abertura, hero, manifesto, cubo, capítulos, decisões, contato, rodapé (teste-guarda de ordem).
- [ ] Quantidades: 2 faixas, 3 vãos no manifesto, 7 cópias da palavra por linha × 3 linhas, 10 retângulos, 7 capítulos, 29 tracinhos, 11 decisões, 100 caixas no desktop e 50 no celular.
- [ ] Nenhum texto, código, imagem, vídeo, modelo ou fonte comercial do RayRay no repositório (teste-guarda procura "RAYRAY", "rayraylab", "Seoul", "awwwards" em `app/` e `src/`).

### Visual e movimento (desktop 1440×900)
- [ ] Abertura: os três trechos aparecem e a abertura some em até 6 s; não volta ao recarregar na mesma sessão.
- [ ] Hero: logotipo com glitch que assenta em 1 s; 3 formas de vidro que refratam o logotipo e reagem ao mouse; faixas correndo em sentidos opostos (200 s por ciclo).
- [ ] O fundo passa de `#F7F7F5` a `#121212` com borda orgânica no fim do hero e só volta ao claro no contato (amostragem de pixels no teste do build).
- [ ] Manifesto: os 3 vãos crescem com a rolagem até 3vw.
- [ ] Cubo gira −90° com a seção fixada e os 10 retângulos encolhem até os tamanhos finais; depois seguem o mouse.
- [ ] Capítulos: a fileira anda na horizontal enquanto a página rola na vertical; os cartazes começam em ASCII e se revelam; a barra de progresso enche.
- [ ] Decisões: a linha cresce, as frases se digitam e o lençol ondula enquanto sobe.
- [ ] Contato: o círculo escuro encolhe; as caixas caem dentro do cubo, que gira sozinho; cursor "grab" sobre o canvas.
- [ ] Cabeçalho inverte sozinho sobre claro e escuro; relógio atualiza a cada segundo; trecho do nome recolhe no hover.
- [ ] Paleta: só os tokens da marca (teste sobre o CSS e o conteúdo); azul só em detalhes.

### Celular (390×844) e movimento reduzido
- [ ] Sem abertura; sem rolagem horizontal em 390 e 1440 px.
- [ ] Capítulos em lista vertical; decisões em lista estática; cubo de física com 50 caixas.
- [ ] Com movimento reduzido: sem abertura, conteúdo inteiro visível, nada se move sozinho.

### Qualidade
- [ ] `npm test`, `npm run check` e `npm run test:build` verdes, local e no CI.
- [ ] Sem erros no console.
- [ ] Lighthouse: acessibilidade ≥ 95; desempenho medido e registrado (sem meta rígida nesta fase, por causa do WebGL).
- [ ] `noindex` no `<meta name="robots">` e no cabeçalho `X-Robots-Tag` da Vercel.

## 7. Testes

- **Micro (Vitest, TDD):** funções de `src/lib` (suavização, relógio em português, contraste WCAG, detecção de celular e de movimento reduzido); integridade do conteúdo (quantidades, só cores da paleta); guarda de privacidade e de cópia; componentes DOM renderizados com React Testing Library (cabeçalho, faixas, manifesto com 3 vãos, cubo com 10 retângulos, barra com 29 tracinhos, 11 decisões).
- **Macro (Playwright sobre `next build` + `next start`):** carrega sem erros; ordem das seções; abertura some; relógio muda; fundo escuro e volta ao claro; galeria anda na horizontal; sem rolagem horizontal em 390 e 1440; celular sem abertura; movimento reduzido sem abertura e com conteúdo visível; `noindex`.
- **Exploração:** capturas em cada seção no desktop e no celular, comparadas lado a lado com as capturas da referência (fora do repositório); Lighthouse.

## 8. Riscos e pendências

| Risco | Mitigação |
|---|---|
| scroll-rig 8 com fiber 9 e React 19 | Primeira tarefa do plano é um esqueleto que prova a combinação; se falhar, cair para fiber 9 + Lenis + `View` do drei, registrando o desvio |
| Desempenho com WebGL pesado | Render target só enquanto o hero está visível; cenas invisíveis param; DPR máx. 2 |
| Testes com WebGL no CI (Chrome sem GPU) | Playwright com o Chromium do próprio Playwright (SwiftShader); os testes medem DOM e pixels, não shaders |
| Fontes do Google no build | `next/font` baixa no build; a Vercel e o GitHub Actions têm rede |
| Vercel ainda configurada como "Other" | `vercel.json` passa a declarar `"framework": "nextjs"` |

**Pendências que continuam:** nome da marca, logotipo final, tom de voz, aprovação do `#5B7BFF` e do `#6B6B6B`, remover o `noindex` quando a identidade for decidida, e apagar os arquivos da identidade antiga (depende da confirmação da pessoa).

## 9. Aprovações

- 2026-10-20: a pessoa pediu "estruture um plano para montar a identidade e faça", autorizando seguir da spec ao plano e à construção sem novas perguntas. Integrar na `main`, publicar e apagar arquivos continuam pedindo confirmação a cada vez.
