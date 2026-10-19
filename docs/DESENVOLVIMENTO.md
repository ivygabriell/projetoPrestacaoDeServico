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

## Comandos do projeto

- Testes: (preencha)
- Tipos / lint: (preencha)
- Build: (preencha)
- Servidor local: (preencha)

## Tarefas e sessões

- Tarefas: issues com o formulário de tarefa (`.github/ISSUE_TEMPLATE/tarefa.yml`).
- Worktrees: `scripts/nova-tarefa.sh <tipo> <slug>` e `scripts/remover-tarefa.sh <tipo> <slug>`.
- Memória do projeto: `docs/memoria-do-projeto.md`.

## Antes do primeiro push para um repositório público

Rode a higiene de dados do método: nada de e-mail pessoal, telefone ou token em documentos, testes e commits.
