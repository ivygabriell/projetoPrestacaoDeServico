# Identidade para as redes sociais

Fase 2 do método (desenho e spec). Data: 2026-10-20. Classificação: **arquitetural** (um conjunto novo de peças e regras, separado do site), feita numa branch própria e sem tocar no site.

## 1. Objetivo e restrições

- **Objetivo:** levar a identidade da marca (feita para o site, sobre o RayRay Lab) para as redes sociais: paleta, tipografia, moldura, elementos gráficos, estilo de post, carrosséis, stories, perfil e tom de voz, com modelos prontos que exportam as imagens no tamanho de cada rede.
- **O que a pessoa disse:** "criar a identidade para as redes sociais, paleta, fontes, carrosséis, estilo de post e etc."; "o que eu acabei de criar foi a identidade dos sites"; "analise e crie baseado no contexto"; "acredito que seja inovação, premium, minimalista, corporativo"; "crie uma pasta dentro desse repositório somente para mexer nisso".
- **O que eu supus (para a pessoa corrigir):**
  - Redes principais: **Instagram** (vitrine) e **LinkedIn** (decisores B2B: sócios de escritórios, donos de clínicas e imobiliárias). Formato padrão do feed: **retrato 1080×1350**, que serve às duas.
  - Nome ainda em aberto: as peças usam **©MARCA** e **@marca.lab** como provisórios, como o site usa ©MARCA.
  - Paleta e fontes são **as mesmas do site**, sem cor nova. No fundo escuro o azul de detalhe é `#5B7BFF`, a mesma proposta (ainda pendente) do site.
  - Nada de dados fictícios: o modelo de case tem campos entre colchetes, e os carrosséis educativos dão conselhos sem números inventados.
  - As imagens exportadas não entram no Git (são regeneradas pelo script).
- **Restrições herdadas do site:** só os tokens da paleta; preto neutro `#121212` (o esverdeado está vetado); azul só em detalhes; nada do RayRay (código, imagens, textos) no repositório; sem e-mail ou telefone.
- **Fora de escopo:** vídeos renderizados (reels), logotipo final, nome da marca, calendário real de publicação, contas nas redes.

## 2. Desenho

### 2.1 Abordagem

| Opção | Resultado | Decisão |
|---|---|---|
| **A. Modelos em HTML e CSS + exportação com Playwright** | Usa as mesmas fontes e tokens do site, fica versionado, edita-se em texto e exporta PNG (e PDF para o carrossel do LinkedIn) no tamanho exato | **Escolhida** |
| B. Arquivos no Canva ou no Figma | Fácil de editar por quem não programa, mas fica fora do repositório e não passa pelos testes-guarda | Descartada por ora; pode vir depois a partir dos PNG |
| C. Só um guia em texto | Rápido, mas não mostra nem entrega as peças | Descartada |

### 2.2 Estrutura

```
redes-sociais/
  README.md              guia completo (essência, formatos, paleta, tipografia, moldura, elementos, pilares, carrosséis, stories, tom, perfil, calendário, como exportar)
  manual.html            o guia em página visual (abre no navegador)
  modelos/
    base.css             tokens, formatos, moldura e elementos gráficos
    pecas.js             desenhos gerados por código (ASCII, panorama, tracinhos, grade de apoio)
    carrossel-manifesto.html   5 lâminas em panorama contínuo
    carrossel-educativo.html   8 lâminas (exemplo: odontologia)
    posts.html           posts avulsos
    stories.html         stories 1080×1920
    perfil.html          avatar, capas de destaque e capa do LinkedIn
  scripts/exportar.mjs   gera PNG (e PDF dos carrosséis) em redes-sociais/exportados/
```

Cada modelo abre no navegador como uma prancha (as peças lado a lado, reduzidas). Com `?exportar` as peças ficam em tamanho real; com `?grade` aparecem as margens e as zonas seguras.

### 2.3 Formatos

| `data-formato` | Tamanho | Uso |
|---|---|---|
| `retrato` | 1080×1350 | Feed e carrosséis (Instagram e LinkedIn) |
| `quadrado` | 1080×1080 | Avatar e capas de destaque |
| `story` | 1080×1920 | Stories e capas de reels |
| `linkedin` | 1584×396 | Capa do perfil do LinkedIn |

## 3. Critérios de aceite

- [ ] A pasta `redes-sociais/` tem o guia, o manual visual, a base, os cinco modelos e o script de exportação.
- [ ] Só as cores da paleta (hexadecimais e `rgb`/`rgba`) no CSS, no HTML e no JS da pasta; nunca `#121813`.
- [ ] Só as três famílias: Inter Tight, Azeret Mono, Instrument Serif.
- [ ] Toda peça tem `data-formato` conhecido e `data-nome` único no arquivo; carrosséis têm de 2 a 10 lâminas.
- [ ] Nada do RayRay, nenhum e-mail ou telefone na pasta.
- [ ] O script exporta cada peça no tamanho exato do formato (confere as dimensões do PNG) e um PDF por carrossel.
- [ ] As peças exportadas foram olhadas uma a uma: texto legível, nada cortado, moldura alinhada, azul só em detalhes.
- [ ] `npm test` e `npm run check` verdes.

## 4. Testes

- **Micro (Vitest):** `tests/unit/redes-sociais.test.ts` com os critérios de estrutura, paleta, fontes, formatos e guardas.
- **Macro:** `node redes-sociais/scripts/exportar.mjs` (falha se alguma dimensão não bater) e a inspeção visual das imagens.

## 5. Aprovações

- 2026-10-20: a pessoa pediu para analisar e criar com base no contexto, sem mais perguntas. Fica na branch `feat/identidade-redes-sociais`; enviar, abrir PR e integrar continuam pedindo confirmação.
