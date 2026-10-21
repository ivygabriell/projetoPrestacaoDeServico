# Identidade sobre o RayRay Lab · Plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** página única de identidade da marca, refeita do zero na estrutura, nos efeitos e na pilha do RayRay Lab, com a paleta da marca.

**Architecture:** Next.js 15.5 (App Router) gera uma página estática. Um único canvas WebGL (`GlobalCanvas` do @14islands/r3f-scroll-rig) fica atrás do DOM; cada seção tem a parte DOM e, quando precisa, uma cena 3D enviada ao canvas por `UseCanvas`. GSAP + ScrollTrigger controlam as timelines; Lenis (dentro do `SmoothScrollbar`) dá a rolagem; cannon-es faz a física do contato.

**Tech Stack:** next 15.5.x, react 19.1.x, three 0.180.0, @react-three/fiber 9.3.x, @react-three/drei 10.7.x, @14islands/r3f-scroll-rig 8.15.x, gsap 3.13.x, cannon-es 0.20.x, three-stdlib 2.36.x, typescript 5.9.x, vitest 3.2.x, @testing-library/react 16.3.x, jsdom 26.1.x, @playwright/test 1.56.x, eslint 9 + eslint-config-next 15.5.

**Spec:** `docs/superpowers/specs/2026-10-20-identidade-rayray-design.md` · auditoria: `docs/referencias/rayraylab.md`.

## Global Constraints

- Cores só destes tokens: `#F7F7F5`, `#DCDCD8`, `#787878`, `#121212`, `#002FA7`, `#5B7BFF` (proposta, só no escuro) e `#FFFFFF` (folhas e cartões). Nunca `#121813`.
- Azul só em detalhes (ponto do relógio, ponto final do logotipo, sublinhado de links, seleção, borda ativa da barra).
- Fontes: Inter Tight (400/500/700/800), Azeret Mono (400), Instrument Serif (400 normal e itálico), via `next/font/google`.
- Breakpoint de celular: `< 900px`. DPR máximo 2.
- Nada do RayRay no repositório: sem código, shaders, imagens, vídeos, modelo GLB, fontes comerciais ou textos; nenhuma ocorrência de `RAYRAY`, `rayraylab`, `Seoul`, `awwwards` (sem diferenciar maiúsculas) em `app/` e `src/`.
- Sem dados pessoais (e-mail, telefone) em `app/` e `src/`.
- `noindex, nofollow` no `<meta name="robots">` e no `X-Robots-Tag` do `vercel.json`.
- Textos em português, todos em `src/conteudo/identidade.ts`.
- Scripts npm fixos (o CI depende deles): `test` (vitest run), `check` (tsc --noEmit + eslint), `test:build` (next build + playwright test), `dev`, `build`, `start`.

## Review Focus

1. **Movimento reduzido ligado no sistema:** a pessoa espera ver todo o conteúdo parado, sem abertura e sem rolagem sequestrada. Teste no Task 12 (`reduzido.spec.ts`).
2. **Janela redimensionada (desktop → celular e o contrário):** as seções fixadas não podem ficar com espaço em branco nem sobrepor conteúdo. Teste no Task 12 (redimensiona de 1440 para 390 e confere ausência de rolagem horizontal e a ordem das seções visíveis).
3. **Recarregar no meio da página:** a abertura não pode cobrir a página de novo nem travar a rolagem. Teste no Task 5 (`sessionStorage` marca a abertura; recarga em `scrollY > 0` começa destravada).
4. **Navegador sem WebGL:** textos e cartazes continuam legíveis. Teste no Task 9 (os cartazes também existem como `<img>` com `alt` no DOM).
5. **Teclado:** menu e links alcançáveis com Tab, com foco visível, apesar do `mix-blend-mode`. Teste no Task 4 (foco visível com `outline` no menu).

---

### Task 1: Esqueleto da pilha, CI e publicação

Prova cedo o maior risco da spec: scroll-rig 8 + fiber 9 + React 19.

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `eslint.config.mjs`, `vitest.config.ts`, `playwright.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `src/componentes/canvas/CanvasGlobal.tsx`, `src/componentes/canvas/Rolagem.tsx`, `src/gsap.ts`, `tests/e2e/base.spec.ts`, `tests/unit/config.test.ts`
- Modify: `.github/workflows/ci.yml`, `vercel.json`, `.gitignore`

**Interfaces:**
- Produces: `CanvasGlobal` (client, envolve `GlobalCanvas` com `flat`, `camera={{ near: 0.01, far: 10000, position: [0, 0, 600] }}`, `dpr={[1, 2]}`); `Rolagem({ travada: boolean })` (client, `SmoothScrollbar` com `config={{ syncTouch: true }}`, `enabled` falso em `< 900px` ou movimento reduzido, chama `ScrollTrigger.update` em cada `onScroll`); `src/gsap.ts` exporta `gsap`, `ScrollTrigger` com `ScrollTrigger`, `TextPlugin` e `EasePack` registrados uma vez.

- [ ] **Step 1: Write the failing tests**
  - `tests/unit/config.test.ts`: lê `.github/workflows/ci.yml` e espera os passos `npm ci`, `npm test`, `npm run check`, `npx playwright install --with-deps chromium` e `npm run test:build`; lê `vercel.json` e espera `framework === "nextjs"`, nenhuma `rewrites` e o header `X-Robots-Tag: noindex, nofollow`.
  - `tests/e2e/base.spec.ts`: `GET /` responde 200; `meta[name=robots]` tem `noindex, nofollow`; `<html lang="pt-BR">`; existe `#ScrollRig-canvas canvas`; nenhum erro no console durante 3 s.
- [ ] **Step 2: Run to verify fail** — `npx vitest run tests/unit/config.test.ts` → FAIL (CI sem os passos novos; `vercel.json` com `rewrites`).
- [ ] **Step 3: Implement** — instalar as versões da Tech Stack com `--save-exact`; `app/layout.tsx` com `metadata.robots = { index: false, follow: false }`, fontes `next/font/google` expostas como variáveis CSS `--sans`, `--mono`, `--serif`; `app/globals.css` com os tokens `--claro`, `--c2`, `--c3`, `--escuro`, `--azul`, `--azul-no-escuro`, `body { background: var(--claro) }`, barra de rolagem escondida; `vercel.json` = `{ framework: "nextjs", headers: [X-Robots-Tag] }`; CI com o passo de instalar o Chromium antes de `test:build`; `playwright.config.ts` com `webServer: npm run start -- -p 3100`, `channel: 'chrome'` fora do CI; `.gitignore` com `.next/`, `test-results/`, `playwright-report/`.
- [ ] **Step 4: Verify** — `npm test && npm run check && npm run test:build` → tudo PASS. Se o scroll-rig falhar com fiber 9, aplicar a alternativa da spec (seção 8) e registrar o desvio no ledger do PR.
- [ ] **Step 5: Commit** — `chore: esqueleto Next.js + R3F + scroll-rig com CI e Vercel`

### Task 2: Funções puras

**Files:**
- Create: `src/lib/suave.ts`, `src/lib/relogio.ts`, `src/lib/contraste.ts`, `src/lib/ambiente.ts`
- Test: `tests/unit/lib.test.ts`

**Interfaces:**
- Produces: `suave(a: number, b: number, x: number): number` (smoothstep cúbico, limitado a 0–1); `limita(x, min, max)`; `relogio(d: Date): string` → `"REC ter13:37:26"` com dias `dom seg ter qua qui sex sáb`; `razaoContraste(hexA: string, hexB: string): number` (WCAG 2.x); `ehCelular(largura: number): boolean` (`< 900`); `prefereMenosMovimento(): boolean` (lê `matchMedia`, falso no servidor).

- [ ] **Step 1: Write the failing tests** — `suave(0,1,0.5) === 0.5`, `suave(0,1,-1) === 0`, `suave(0,1,2) === 1`; `relogio(new Date(2026, 9, 20, 13, 7, 5)) === "REC ter13:07:05"`; `razaoContraste('#F7F7F5', '#121212')` ≈ 17,46 (2 casas); `razaoContraste('#002FA7', '#121212')` ≈ 1,75; `razaoContraste('#5B7BFF', '#121212')` ≈ 5,10; `ehCelular(899) === true`, `ehCelular(900) === false`.
- [ ] **Step 2: Run** — `npx vitest run tests/unit/lib.test.ts` → FAIL (módulos não existem).
- [ ] **Step 3: Implement** os quatro arquivos.
- [ ] **Step 4: Run** → PASS; `npm test` inteiro → PASS.
- [ ] **Step 5: Commit** — `feat: funções de suavização, relógio, contraste e ambiente`

### Task 3: Conteúdo e testes-guarda

**Files:**
- Create: `src/conteudo/identidade.ts`
- Test: `tests/unit/conteudo.test.ts`, `tests/unit/guardas.test.ts`

**Interfaces:**
- Produces (todos `as const`): `paleta: { hex: string; nome: string; uso: string }[]` (5 itens); `abertura: [string, string, string]`; `faixas: [string[], string[]]` (10 itens cada); `intro: string`; `manifesto: { rotulo: string; partes: string[] }` (`partes` separadas pelos 3 vãos, logo 4 partes); `apoio: string`; `cubo: { palavra: 'MARCA'; legenda: string }`; `unico: { rotulo: string; paragrafos: [string, string] }`; `capitulos: { id: string; titulo: string; subtitulo: string; categoria: string; tipo: 'paleta' | 'azul' | 'sans' | 'mono' | 'serif' | 'movimento' | 'contraste' }[]` (7); `decisoes: { rotulo: [string, string]; frases: [string, string]; itens: string[] }` (11 itens); `contato: string`; `rodape: { titulo: string; linhas: { rotulo: string; valor: string }[]; credito: string }`; `cabecalho: { nome: string; recolhe: string; fim: string; menu: { rotulo: string; alvo: string }[] }`; `selo: string`. Textos exatamente os da seção 5 da spec.

- [ ] **Step 1: Write the failing tests**
  - `conteudo.test.ts`: quantidades (2 faixas × 10, 4 partes do manifesto, 7 capítulos, 11 decisões, 5 cores, 3 trechos da abertura); `paleta.map(c => c.hex)` igual a `['#F7F7F5','#DCDCD8','#787878','#121212','#002FA7']`; `cubo.palavra === 'MARCA'`.
  - `guardas.test.ts`: percorre `app/` e `src/` e falha se achar `/rayray|rayraylab|seoul|awwwards/i`, `#121813`, um e-mail (`/[\w.+-]+@[\w-]+\.[\w.]+/`) ou telefone (`/\+?\d[\d\s().-]{8,}\d/`); falha se achar em `app/**/*.css` uma cor hex fora da lista da Global Constraints.
- [ ] **Step 2: Run** → FAIL (arquivo não existe).
- [ ] **Step 3: Implement** `src/conteudo/identidade.ts`.
- [ ] **Step 4: Run** → PASS; `npm test` → PASS.
- [ ] **Step 5: Commit** — `feat: conteúdo da identidade e testes-guarda`

### Task 4: Cabeçalho e selo lateral

**Files:**
- Create: `src/componentes/cabecalho/Cabecalho.tsx`, `src/componentes/cabecalho/SeloLateral.tsx`
- Modify: `app/layout.tsx`, `app/globals.css`
- Test: `tests/unit/cabecalho.test.tsx`

**Interfaces:**
- Consumes: `relogio`, `cabecalho`, `selo`.
- Produces: `<Cabecalho visivel: boolean />` (classe `cabecalho`, `mix-blend-mode: difference`, cor `#F7F7F5`; topo 12px, laterais 30px; Azeret Mono 15px caixa-alta, tracking −0,02em); `<SeloLateral />`.

- [ ] **Step 1: Write the failing test** — renderiza o cabeçalho com `vi.useFakeTimers()` e data fixa; espera o texto `REC ter13:07:05`; avança 1 s e espera `REC ter13:07:06`; espera `©MARCA`, o trecho `.recolhe` e cada item do menu com duas cópias (`.menu-texto` e `.menu-texto2`); espera `href` dos itens iguais aos `alvo`; o selo tem o texto de `selo`.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** — CSS: `.recolhe` 126px → 0 no hover do nome em 0,3 s; menu: cópia 1 vai a `translateY(-10px) rotateX(90deg)` e a cópia 2 de `translateZ(20px) rotateX(90deg)` a `rotateX(0)`, 0,3 s; `:focus-visible` com `outline: 1px solid currentColor; outline-offset: 4px`; ponto do REC azul piscando; selo fixo à direita a 50%.
- [ ] **Step 4: Run** → PASS; `npm test` → PASS.
- [ ] **Step 5: Commit** — `feat: cabeçalho com relógio, nome que recolhe e selo lateral`

### Task 5: Abertura

**Files:**
- Create: `src/componentes/abertura/Abertura.tsx`, `src/componentes/abertura/filmeAbertura.ts`
- Modify: `app/page.tsx`, `app/globals.css`
- Test: `tests/unit/abertura.test.tsx`, `tests/e2e/abertura.spec.ts`

**Interfaces:**
- Consumes: `abertura`, `gsap`, `ehCelular`, `prefereMenosMovimento`.
- Produces: `<Abertura aoTerminar={() => void} />`; `deveTocarAbertura(largura: number, reduzido: boolean, jaTocou: boolean): boolean`; chave `sessionStorage` `abertura-tocou`; `desenharFilme(ctx: CanvasRenderingContext2D, t: number): void` (animação 300×158 em canvas: faixas de ruído em tons de cinza e o logotipo deslizando por linhas).

- [ ] **Step 1: Write the failing tests**
  - unit: `deveTocarAbertura(1440, false, false) === true`; `(390, false, false) === false`; `(1440, true, false) === false`; `(1440, false, true) === false`.
  - e2e (1440×900): os 3 trechos ficam visíveis; `.abertura` some (`display: none`) em até 6 s; recarregar na mesma página não mostra `.abertura`; com `scrollY > 0` antes da recarga, a página rola com a roda depois de 1 s.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** — timeline: trecho 1 opacidade 1 em 0,2 s; trecho 2 em 0,2 s; trecho 3 em 0,3 s com 0,1 s de atraso; depois de 0,5 s, a caixa vai a `scaleY: 0` e o texto a `autoAlpha: 0` em 0,3 s (`power2.out`); `aoTerminar` destrava a `Rolagem` e dispara a entrada do hero; grava a chave na sessão.
- [ ] **Step 4: Run** → PASS (unit e e2e).
- [ ] **Step 5: Commit** — `feat: abertura com filme em canvas que toca uma vez por sessão`

### Task 6: Hero

**Files:**
- Create: `src/componentes/hero/Hero.tsx`, `src/componentes/hero/CenaHero.tsx`, `src/componentes/hero/formas.ts`, `src/texturas/logotipo.ts`, `src/shaders/glitch.ts`, `src/shaders/refracao.ts`
- Modify: `app/page.tsx`, `app/globals.css`
- Test: `tests/unit/hero.test.tsx`, `tests/unit/formas.test.ts`

**Interfaces:**
- Consumes: `faixas`, `intro`, `gsap`, `ScrollTrigger`, `suave`.
- Produces: `<Hero entrar: boolean />` (seção `.secao-hero`, 100vh); `desenharLogotipo(texto: string, largura: number): HTMLCanvasElement` (Inter Tight 800, ponto final em `#002FA7`, fundo transparente); `criarFormas(): { principal: THREE.BufferGeometry; laje: THREE.BufferGeometry; pequena: THREE.BufferGeometry }` (extrusões com chanfro geradas por código: retângulo arredondado com furo circular, laje larga e baixa, peça arredondada pequena); shaders `glitchFrag` (deslocamento horizontal por linha até 6% e borrão ×6, ambos × `(1 − uProgress)`) e `refracaoFrag` (amostra `uFundo` em `gl_FragCoord/uResolucao`, ondulação por ruído no tempo, borrão direcional com `uBorrao`, fresnel e especular; `uOpacidade`).

- [ ] **Step 1: Write the failing tests**
  - `hero.test.tsx`: 2 `.faixa` com os 10 itens de cada faixa repetidos ≥ 3 vezes; o texto de intro dividido em `.palavra-intro` (≥ 10 spans); existe `.role-para-baixo` com "role para baixo".
  - `formas.test.ts`: `criarFormas()` devolve 3 geometrias com `attributes.position.count > 0` e a principal com caixa limite mais larga que alta.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** — CSS das faixas: fundo `#FFFFFF`, 30px de altura no meio da tela, 11px peso 500, `band` 9000px que anda 6000px em 200 s (uma em cada sentido). Cena: render target do tamanho da tela; a cada quadro desenha a cena sem as formas no alvo e passa a textura às formas. Timeline de entrada (quando `entrar`): `uProgress` 0→1 em 1 s a partir de 1,2 s (`power1.inOut`); formas sobem: principal 1,8 s (`power1.inOut`) a partir de 0, as outras em 1,4 s a partir de 0 e de 0,5 s; principal começa girada 0,15π em Y (2 s a partir de 0,4); faixas opacidade 1 em 0,5 s a partir de 1,5 s; cada palavra da intro pisca (opacidade de 0 em 0,1 s, `repeat: 5`) em 1,5 s + aleatório(0–1); "role para baixo" em 1 s. Flutuação senoidal e mouse conforme a auditoria 3.2; `uBorrao = (5·mouse.x, 3·mouse.y)`. Saída: `ScrollTrigger` em `.secao-hero`, `start: 'top+=10'`, `end: '+=' + 2 * innerHeight`, `scrub: 1` (faixas e "role para baixo" somem em 0,2; formas crescem e giram; opacidade do vidro a 0). Vidro em DOM (`.vidro-dom`): recorte SVG próprio com `backdrop-filter: blur(8px)` e fundo branco a 10% acompanhando a forma pequena. Celular: só a forma principal, maior.
- [ ] **Step 4: Run** → PASS; abrir `npm run dev` e capturar o hero a 1440×900 para conferir a refração.
- [ ] **Step 5: Commit** — `feat: hero com logotipo em glitch e vidro 3D que refrata`

### Task 7: Passagem para o escuro

**Files:**
- Create: `src/componentes/passagem/CenaPassagem.tsx`, `src/shaders/passagem.ts`
- Modify: `app/page.tsx`
- Test: `tests/e2e/cor.spec.ts`

**Interfaces:**
- Consumes: `ScrollTrigger`, `gsap`.
- Produces: plano de `2·innerWidth × 2·innerHeight` em z = −100, cor `#121212`; `passagemFrag` com `alpha = suave(0, 1, (1 − vUv.y) + ruido(vUv.x·6, vUv.y·3, uTempo)·0,2 + (1 − 3·uProgresso))`; `uProgresso` vai de 1 a 0 com `ScrollTrigger` em `.secao-hero`, `start: 'top+=' + 0.6 * innerHeight`, `end: '+=' + 0.6 * innerHeight`, `scrub: 1`; o plano some ao entrar no contato.

- [ ] **Step 1: Write the failing test** — `cor.spec.ts` (1440×900): pixel em (720, 450) perto de `#F7F7F5` no topo; ao rolar até `.secao-manifesto`, pixel num canto vazio perto de `#121212` (tolerância 6 por canal); ao rolar até `.secao-contato` depois do círculo encolher, perto de `#F7F7F5`.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement**. No celular e com movimento reduzido, sem o plano: as seções escuras (`manifesto` a `decisoes`) recebem `background: var(--escuro)` por CSS.
- [ ] **Step 4: Run** → PASS (desktop e 390×844).
- [ ] **Step 5: Commit** — `feat: passagem para o escuro com borda orgânica`

### Task 8: Manifesto e cubo da marca

**Files:**
- Create: `src/componentes/manifesto/Manifesto.tsx`, `src/componentes/manifesto/CuboMarca.tsx`, `src/texturas/fundoDesfocado.ts`
- Modify: `app/page.tsx`, `app/globals.css`
- Test: `tests/unit/manifesto.test.tsx`

**Interfaces:**
- Consumes: `manifesto`, `apoio`, `cubo`, `unico`, `gsap`, `ScrollTrigger`.
- Produces: `.secao-manifesto` com `.vao` ×3; `.cubo` (1000×600, `transform-style: preserve-3d`) com `.cubo-frente` (3 linhas × 7 `.palavra-contorno`) e `.cubo-lado` (10 `.caixa` + fundo de `desenharFundoDesfocado(1000, 600)` + legenda); `desenharFundoDesfocado(l: number, a: number): string` (data URL: manchas cinza desfocadas com um toque de `#002FA7`).

- [ ] **Step 1: Write the failing test** — 3 `.vao`; texto do manifesto em caixa-alta via CSS (classe `manifesto-texto`); 21 `.palavra-contorno` com o texto `MARCA`; 10 `.caixa`; rótulos "(Quem somos)" e "(O que é único)".
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** — manifesto 3,7vw/3,32vw, peso 500, justificado, padding superior 85vh; vãos 0 → `0.03 * innerWidth` (`scrub: 1`, `start: 'top -=50'`, `end: '+=200'`). Palavras em contorno: transparente com `-webkit-text-stroke: 1px #F7F7F5`, 230px peso 700, animação `girarX` 12 s linear infinita (0° p1000 → 90° p600 → 180° p1000 → 270° p600 → 360° p1000), atrasos 0 / 2,4 / 4,8 / 7,2 / 9,6 s, 2 cópias paradas (0° e 180°). Timeline fixada (`pin: true`, `scrub: 1`, `end: '+=' + 0.8 * innerHeight`): cubo a `rotateY(-90.01deg)` em 1 a partir de 0,1; caixas `from { width: 1200, height: 800 }` em 0,3 com `stagger: 0.01` a partir de 1,1; borda do lado 1px em 1,2. Tamanhos finais das caixas: 43×66, 74×110, 110×170, 160×250, 230×370, 330×530, 454×803, 620×1076, 780×1240, 980×1430. Depois de 87%: pausar as palavras e seguir o mouse (`left/top` em %, duração `0.15 * índice`). Celular: gira uma vez ao entrar, sem fixar.
- [ ] **Step 4: Run** → PASS; captura do cubo antes e depois do giro.
- [ ] **Step 5: Commit** — `feat: manifesto com vãos e cubo da marca`

### Task 9: Capítulos (galeria horizontal com ASCII)

**Files:**
- Create: `src/componentes/capitulos/Capitulos.tsx`, `src/componentes/capitulos/CenaCartoes.tsx`, `src/componentes/capitulos/BarraProgresso.tsx`, `src/componentes/capitulos/Previa.tsx`, `src/texturas/cartazes.ts`, `src/shaders/ascii.ts`
- Modify: `app/page.tsx`, `app/globals.css`
- Test: `tests/unit/capitulos.test.tsx`, `tests/e2e/capitulos.spec.ts`

**Interfaces:**
- Consumes: `capitulos`, `paleta`, `razaoContraste`, `gsap`, `ScrollTrigger`, `suave`.
- Produces: `desenharCartaz(tipo: Capitulo['tipo'], l: number, a: number): HTMLCanvasElement`; `<BarraProgresso progresso: number />` (29 `.tracinho` a cada 9px + `.barra-ativa`); `asciiFrag` (cinza por luminância + ruído escolhe entre 8 glifos 5×5 próprios, célula de 15px, fundo `#121212`; varredura de baixo para cima por `uProgresso`; `uHover` aplica zoom 10% e escurece 30%).

- [ ] **Step 1: Write the failing tests**
  - unit: 7 `.cartao` com título e subtítulo; cada cartão tem um `<img>` com `alt` igual ao título (fallback sem WebGL); `BarraProgresso` tem 29 `.tracinho`, o i-ésimo com `left: 9·i px`.
  - e2e (1440×900): ao rolar 2 telas dentro de `.secao-capitulos`, o `transform` de `.cartoes` tem `translateX` negativo e a seção continua no topo (fixada); a largura de `.barra-ativa` cresce.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** — cartões 50vh × 74vh, espaço `calc((100vw - 150vh - 60px) / 2)`; timeline fixada (`start: 'top top'`, `end: '+=' + (larguraExtra - 500)`, `scrub: 1`): progresso do ASCII 0→1 em 0,5; `.cartoes` a `x: -larguraExtra` em 2 a partir de 0,6; barra a 100% em 2,5; no fim a barra gira 6° e some (0,3 a partir de 2,6); tracinhos com opacidade `suave(0.02, 0.1, (i + 1) / 28 - progresso)`. Hover: `uHover` 0→1 em 0,4 s e volta em 0,3 s; `<Previa>` (250px, `scaleY 0→1` em 0,3 s) com o cartaz animado em canvas. Celular: lista vertical com as imagens, sem ASCII, sem prévia, sem barra.
- [ ] **Step 4: Run** → PASS; captura do ASCII no meio da revelação.
- [ ] **Step 5: Commit** — `feat: capítulos em galeria horizontal com revelação em ASCII`

### Task 10: Decisões no lençol

**Files:**
- Create: `src/componentes/decisoes/Decisoes.tsx`, `src/componentes/decisoes/CenaLencol.tsx`, `src/texturas/folhaDecisoes.ts`, `src/shaders/tecido.ts`
- Modify: `app/page.tsx`, `app/globals.css`
- Test: `tests/unit/decisoes.test.tsx`, `tests/e2e/decisoes.spec.ts`

**Interfaces:**
- Consumes: `decisoes`, `gsap` (TextPlugin), `ScrollTrigger`.
- Produces: `desenharFolha(itens: string[], largura: number): HTMLCanvasElement` (folha `#FFFFFF`, tracejado 2px `#121212` em cima e embaixo, itens grandes em Inter Tight 500 com número sobrescrito "(n)"); `tecidoVert` (deslocamento em Z `sin(y·1,2π + t·3)·18 + cos(x·1,8π + t·2)·24`, multiplicado por `1 − suave(0,1, 0,98, uv.y)`); plano 60vw de largura, 20×24 segmentos.

- [ ] **Step 1: Write the failing tests**
  - unit: rótulos "(Decisões" e "& Registro)" com `.linha` entre eles; 2 `.frase`; lista DOM `.lista-decisoes` com 11 `li` (fallback e versão do celular).
  - e2e: ao rolar até o meio da seção, a largura de `.linha` > 0 e o texto da primeira `.frase` está completo.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** — timeline fixada (`pin: true`, `scrub: 1`, `end: '+=' + 1.2 * alturaFolha`): `.linha` a `calc(60vw + 200px)` em 1 a partir de 0,5; frases `from { text: '' }` em 1,2 s com `stagger: 0.5` a partir de 1,4; o lençol sobe por trás da máscara (6 unidades lineares a partir de 1,5). No desktop a lista DOM fica visualmente oculta (acessível a leitores de tela); no celular, a lista DOM aparece como folha estática.
- [ ] **Step 4: Run** → PASS; captura do lençol ondulando.
- [ ] **Step 5: Commit** — `feat: decisões numa folha que ondula como tecido`

### Task 11: Contato, física e rodapé

**Files:**
- Create: `src/componentes/contato/Contato.tsx`, `src/componentes/contato/CenaFisica.tsx`, `src/componentes/contato/mundo.ts`, `src/componentes/contato/Rodape.tsx`
- Modify: `app/page.tsx`, `app/globals.css`
- Test: `tests/unit/mundo.test.ts`, `tests/unit/contato.test.tsx`

**Interfaces:**
- Consumes: `contato`, `rodape`, `gsap`, `ScrollTrigger`, `ehCelular`, `prefereMenosMovimento`.
- Produces: `criarMundo(qtd: number): { mundo: CANNON.World; caixas: CANNON.Body[] }` (gravidade 10, 6 planos a ±0,5 de um cubo de lado 1 deslocado −0,1 em Y, caixas de meia-aresta `0.6 * 0.05`, atrito 0,1, restituição 0,9, posições iniciais numa espiral de raio 0,03, impulso ±7 em cada eixo); `<CenaFisica qtd={100 | 50} />` (`InstancedMesh` de `RoundedBoxGeometry(0.05, 0.05, 0.05, 2, 0.02)` em `#121212`, arestas `#787878`, `OrbitControls` com `autoRotate`, velocidade 10, amortecimento, sem zoom e sem arrastar, polar 0,1π–0,9π; gravidade = (0, −10, 0) girada pela câmera a cada quadro; cursor `grab`).

- [ ] **Step 1: Write the failing tests**
  - `mundo.test.ts`: `criarMundo(100).caixas.length === 100`; depois de 300 passos de `1/60`, todas as caixas dentro do cubo (|x|, |z| ≤ 0,5 e −0,6 ≤ y ≤ 0,4); `criarMundo(50).caixas.length === 50`.
  - `contato.test.tsx`: frase do contato presente; `.circulo-escuro` presente; rodapé com título, as 4 linhas e o crédito, rótulos em `<i>`.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** — `.secao-contato` 100vh, frase 3,1vw/2,8vw peso 500 justificada em caixa-alta; timeline fixada (`start: 'top top'`, `end: '+=' + 0.8 * innerHeight`, `scrub: 1`): círculo de 130vw a `scale: 0` em 1,5 com `expoScale(3, 1)`; ao chegar a 100%, liga a física e o giro automático; ao voltar a 0, zera as caixas. Rodapé fixo embaixo em Instrument Serif (título 1,56vw, valores 1,46vw caixa-alta, rótulos 1vw itálico), visível só dentro do contato. Movimento reduzido: sem física (caixas paradas no fundo) e sem giro.
- [ ] **Step 4: Run** → PASS; captura das caixas no fundo do cubo girando.
- [ ] **Step 5: Commit** — `feat: contato com cubo de física e rodapé em serifa`

### Task 12: Celular, movimento reduzido e matriz macro

**Files:**
- Modify: componentes das Tasks 5 a 11 onde faltar o ramo de celular ou de movimento reduzido; `app/globals.css`
- Test: `tests/e2e/celular.spec.ts`, `tests/e2e/reduzido.spec.ts`, `tests/e2e/ordem.spec.ts`

- [ ] **Step 1: Write the failing tests**
  - `ordem.spec.ts`: as seções aparecem nesta ordem no DOM: `.secao-hero`, `.secao-manifesto`, `.secao-capitulos`, `.secao-decisoes`, `.secao-contato`; `scrollWidth <= innerWidth` em 1440 e 390; redimensionar de 1440 para 390 mantém `scrollWidth <= innerWidth`.
  - `celular.spec.ts` (390×844, toque): sem `.abertura`; `.cartoes` em coluna (cartões com `top` crescente); `.lista-decisoes` visível; `<html>` sem a classe de rolagem suave.
  - `reduzido.spec.ts` (`reducedMotion: 'reduce'`, 1440×900): sem `.abertura`; o texto do manifesto, os 7 títulos e as 11 decisões visíveis sem rolar dentro de seções fixadas; nenhum `pin-spacer`.
- [ ] **Step 2: Run** — `npm run test:build` → FAIL nos ramos que faltarem.
- [ ] **Step 3: Implement** os ramos que faltarem.
- [ ] **Step 4: Run** — `npm test && npm run check && npm run test:build` → tudo PASS.
- [ ] **Step 5: Commit** — `feat: celular e movimento reduzido`

### Task 13: Documentação do projeto e validação

**Files:**
- Modify: `CLAUDE.md`, `docs/DESENVOLVIMENTO.md`, `docs/memoria-do-projeto.md`
- Test: `tests/unit/docs.test.ts`

- [ ] **Step 1: Write the failing test** — `docs.test.ts`: `docs/DESENVOLVIMENTO.md` lista `npm test`, `npm run check`, `npm run test:build` e `npm run dev`; não cita mais os `rewrites` antigos; `CLAUDE.md` aponta para `docs/referencias/rayraylab.md` como referência única.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** — comandos, pilha, publicação (Vercel com Next.js e `noindex`), referência única e estado na memória.
- [ ] **Step 4: Verify** — `npm test && npm run check && npm run test:build` verdes; Lighthouse desktop e celular registrado no PR; capturas de cada seção comparadas com as da referência; revisão de contexto limpo (`superpowers:requesting-code-review`).
- [ ] **Step 5: Commit** — `docs: comandos, pilha e referência única`
