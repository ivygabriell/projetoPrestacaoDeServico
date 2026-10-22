# Memória do projeto

A memória do projeto é o que a próxima sessão precisa saber para não recomeçar do zero. Guarde no mecanismo de memória do Claude Code ou em um `CLAUDE.md` na raiz. **Regra:** guarde o que não dá para descobrir lendo o código ou o histórico (decisões, preferências, pendências, lições), e nunca dados sensíveis.

## O que guardar

| Tipo | Exemplos |
|---|---|
| **Quem é a pessoa e como trabalha** | Idioma das respostas; quer o fluxo Superpowers; corrige por mensagens curtas, então confirme a interpretação com evidência antes de entregar |
| **Fluxo combinado** | Uma branch por mudança; enviar a branch antes de integrar; só a integradora integra; Skills em todo cenário; proteção da `main` ativa |
| **Decisões do projeto** | Público-alvo, estrutura aprovada, paleta, o que não pode mudar, o que ficou de fora e por quê |
| **Estado** | O que está integrado, o que está em andamento, o endereço do repositório, os comandos de teste |
| **Pendências** | Lista curta e viva, com a decisão que cada uma espera |
| **Lições** | Regras que vieram de um erro (por exemplo, "achar a seção pelo título exato") |
| **Referências** | Onde estão a spec, o plano, o painel de tarefas e a referência estudada |

## O que NÃO guardar

- E-mail, telefone, tokens, chaves e senhas.
- O que já está no código ou no histórico do Git (estrutura de arquivos, quem mudou o quê).
- Detalhes que só valem para a conversa de hoje.

## Gabarito

```markdown
---
name: nome-curto-do-projeto
description: uma linha que diga para que serve esta memória
type: project
---

Estado (AAAA-MM-DD): o que está integrado e onde (repositório, branch principal, comandos de teste).

Decisões da pessoa: ...

Pendências (em aberto):
- ...

**Why:** por que esta memória existe.
**How to apply:** como usar nas próximas sessões.
```

Mantenha **uma linha por memória** no índice (`MEMORY.md`), com um gancho que diga quando ela é relevante, e atualize ou apague memórias que ficaram erradas.

---

## Estado do projeto

**2026-10-19, Fases 0 e 1 (descoberta e referências), em andamento**

- **O que é:** identidade de marca + site da própria empresa (prestação de serviços B2B que entrega sites). O site é a vitrine/portfólio e precisa *demonstrar* a capacidade de entregar um site excelente.
- **Nichos dos clientes:** imobiliário, odontológico e escritórios de advocacia.
- **Objetivo do site (confirmado):** o visitante tem que pensar *"esses caras são bons"* de imediato; o próprio site é a prova da qualidade.
- **Ordem:** primeiro a identidade (nome/posicionamento se faltar, paleta, tipografia, tom), depois o site sobre ela.
- **Referência:** desde 2026-10-20, **somente o RayRay Lab**, como base de estrutura, efeitos, seções, animações e pilha (decisão da pessoa; a path digital saiu). Auditoria em [docs/referencias/rayraylab.md](referencias/rayraylab.md).
- **Identidade, decisões tomadas (2026-10-20):** direção **A · Laboratório monocromático** (base RayRay) com **detalhes em azul profundo `#002FA7`**. Paleta: `#F7F7F5` (claro), `#DCDCD8`, `#787878`, `#121212` (preto neutro; **a pessoa vetou o preto esverdeado `#121813` em 2026-10-20**) e o azul só em detalhes (ponto do relógio, glitch, ponto final, reflexo do vidro, sublinhado de links, seleção de texto). **Cor ao longo da página:** um só trecho escuro (do manifesto às decisões), com passagem orgânica para o escuro e volta ao claro no contato; a alternância em todas as seções ficou "pisca-pisca" e a pessoa vetou (2026-10-20). Rolagem lenta e limpa pela Lenis do r3f-scroll-rig. Tipografia: **Inter Tight** (títulos pesados em caixa-alta e manifesto), **Azeret Mono** (rótulos e interface), **Instrument Serif** itálica (detalhes), todas gratuitas no Google Fonts.
- **Catálogo de efeitos (2026-10-20, substituído):** os 47 efeitos das duas referências ficaram no histórico do Git; com a decisão de usar só o RayRay, os efeitos da página são os da auditoria.
- **Contraste (achados abertos):** azul `#002FA7` some no fundo escuro (1,75; proposta `#5B7BFF`, 5,10) e cinza `#787878` não passa AA em texto pequeno (proposta `#6B6B6B`).
- **Publicação provisória:** https://prest-servicos.vercel.app (projeto Vercel `prest-servicos`, publica a cada merge na `main`). Com a nova pilha, o `vercel.json` declara Next.js. Continua como **rascunho fora dos buscadores** (`noindex`); tirar quando a identidade for decidida.
- **Identidade refeita sobre o RayRay (2026-10-20, integrada na `main` pelo PR #6 em 2026-10-21):** a página de identidade foi refeita do zero em Next.js + R3F + scroll-rig + GSAP + cannon-es, seguindo a [spec](superpowers/specs/2026-10-20-identidade-rayray-design.md) e o [plano](superpowers/plans/2026-10-20-identidade-rayray.md). Sequência: abertura → hero (logotipo provisório IDENTIDADE com glitch e vidro 3D que refrata) → passagem para o escuro com borda orgânica → manifesto com vãos → cubo da marca → capítulos em galeria horizontal com ASCII → decisões num lençol → contato com cubo de física → rodapé em serifa. Uma só parte escura (do manifesto às decisões). Celular e movimento reduzido tratados.
- **Identidade nas redes sociais (2026-10-21, branch `feat/identidade-redes-sociais`, em dia com a `main` e o método 2.5.0 desde 2026-10-22):** pasta `redes-sociais/` com guia, manual visual e modelos HTML (carrossel manifesto em panorama, carrossel educativo de odontologia, 7 posts, 4 stories, avatar, destaques e capa do LinkedIn) que exportam PNG e PDF. A pessoa definiu os atributos: **inovação, premium, minimalista, corporativo**, e pediu para analisar e criar sem mais perguntas. Mesma paleta e fontes do site; feed com as peças escuras juntas numa linha (sem xadrez); ©MARCA e @marca.lab provisórios; nada de dado inventado (case com campos entre colchetes). Spec em [superpowers/specs/2026-10-20-identidade-redes-sociais-design.md](superpowers/specs/2026-10-20-identidade-redes-sociais-design.md).
- **Arquivos da identidade antiga** (`docs/identidade/` e `docs/referencias/estudo-das-referencias.md`): a pessoa pediu para apagar o contexto desnecessário; a remoção espera a confirmação dela (regra do `CLAUDE.md`). O manual antigo e o catálogo de 47 efeitos continuam no histórico do Git.
- **Cenário do método:** `site-estatico` (método 2.5.0). Repositório público `ivygabriell/projetoPrestacaoDeServico`, com a `main` protegida (check "Testes, tipos e build"). Comandos em [DESENVOLVIMENTO.md](DESENVOLVIMENTO.md).
- **Lições deste ciclo (levar ao método na Fase 9):** (1) conferir o código de saída dos testes antes do commit, não um `grep` da saída; (2) um `next dev` aberto pela pessoa corrompe o build de produção usado nos testes: testar em outra pasta (`NEXT_DIST_DIR`); (3) no r3f-scroll-rig, props que mudam depois da montagem vão no `<UseCanvas>`, não no filho.
- **Pendências:** aprovar a identidade das redes (e escolher a primeira série educativa); confirmar a remoção dos arquivos da identidade antiga; nome da marca **adiado pela pessoa** (favorito até agora: **Vero**, "verdadeiro"; complementos considerados: Studio, Lab, Atelier; possível conflito de busca com uma operadora de internet chamada Vero, a confirmar no INPI), alternativas gratuitas ou licença das fontes, duração da abertura, quanto de WebGL entra.
- **Atualizado para o método `2.4.0` em 2026-10-21:** modo de orquestração com o Orca (rascunho; o projeto já está registrado no Orca) e a skill `/metodo:atualizar-projeto`; `CLAUDE.md` e `docs/DESENVOLVIMENTO.md` ganharam as regras novas, sem mudar comandos nem decisões do projeto.
- **Atualizado para o método `2.5.0` em 2026-10-22:** no Orca, a coordenadora é sempre Claude e os agentes são Claude (`--agent claude`); no back podem ser Codex, que lê o `AGENTS.md` (acrescentado). Este projeto é um site estático sem back, então o modo Codex não se aplica por enquanto.
