# Como desenvolvemos este projeto

Versão do método: 2.3.2
Cenários aplicados:
- site-estatico (testado em 1 projeto)

Os detalhes de cada fase, os cenários, os casos e as lições ficam no repositório do método (privado). Este documento registra só o que vale **neste projeto**: ajuste-o à medida que decidir.

## Regras que valem aqui

1. **Alvo antes de construir.** Entender, escrever de volta, desenhar e só então construir.
2. **Uma mudança, uma branch.** Nunca commit direto na `main`; tudo entra por Pull Request com o CI verde.
3. **Teste primeiro, em duas camadas.** Micro (TDD, visto falhar antes do código) e macro (suíte completa, build, exploração).
4. **Quem constrói não valida.** A sessão integradora refaz os testes e explora o resultado antes de integrar.
5. **As branches integradas ficam no GitHub.** Integre com `gh pr merge N --merge`, sem `--delete-branch`.
6. **O humano decide o que é externo ou irreversível:** publicar, integrar, apagar, reescrever histórico.

## Pilha

Next.js 15.5 (App Router) com React 19, Three.js r180, @react-three/fiber 9, @14islands/r3f-scroll-rig 8 (canvas global e Lenis), GSAP 3.13 (ScrollTrigger, TextPlugin, EasePack), cannon-es e three-stdlib. É a pilha medida no RayRay Lab ([auditoria](referencias/rayraylab.md)); a escolha está na [spec](superpowers/specs/2026-10-20-identidade-rayray-design.md).

- Um único canvas WebGL fica atrás do DOM (`src/componentes/canvas/CanvasGlobal.tsx`). Cada seção manda a própria cena com `<UseCanvas>`. O `UseCanvas` guarda o elemento filho na montagem: o que muda depois vai como prop do próprio `UseCanvas`.
- Timelines com `pin` rodam em `useEfeitoDeLayout` (`src/lib/useEfeitoDeLayout.ts`), para o GSAP desfazer o pin-spacer antes de o React remover a seção.
- Textos e dados ficam em `src/conteudo/identidade.ts`; cores só da paleta (teste-guarda em `tests/unit/guardas.test.ts`).

## Comandos do projeto

- Servidor local: `npm run dev` (http://localhost:3000)
- Testes: `npm test` (Vitest, micro)
- Tipos e lint: `npm run check`
- Build e testes do build: `npm run test:build` (build em `.next-teste` + Playwright; usa o Chrome da máquina e, no CI, o Chromium do Playwright)
- Build de produção: `npm run build` e `npm run start`

## Publicação provisória (Vercel)

A Vercel publica a página de identidade a cada merge na `main`. O `vercel.json` declara `"framework": "nextjs"` (o projeto foi criado como "Other").

Enquanto for rascunho, tudo sai dos buscadores: cabeçalho `X-Robots-Tag: noindex, nofollow` no `vercel.json` e `robots: { index: false, follow: false }` nos metadados de `app/layout.tsx`. Remover quando a identidade for decidida.

## Tarefas e sessões

- Tarefas: issues com o formulário de tarefa (`.github/ISSUE_TEMPLATE/tarefa.yml`).
- Worktrees: `scripts/nova-tarefa.sh <tipo> <slug>` e `scripts/remover-tarefa.sh <tipo> <slug>`.
- Memória do projeto: `docs/memoria-do-projeto.md`.

## Antes do primeiro push para um repositório público

Rode a higiene de dados do método: nada de e-mail pessoal, telefone ou token em documentos, testes e commits.
