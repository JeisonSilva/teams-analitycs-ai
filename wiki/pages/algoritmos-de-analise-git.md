# Algoritmos de Análise Git

**ID da página:** P004
**Criada em:** 2026-05-21
**Última atualização:** 2026-05-21
**Sessões que contribuíram:** S004

---

## Contexto

O core de análise é composto por três módulos — parser de git log, análise de desenvolvedores e análise de domínios — que transformam o histórico bruto de um repositório Git em dados estruturados consumíveis pela tool MCP e pelo agente de IA.

---

## Conhecimento acumulado

### git-log-parser — extração do histórico

O parser executa `git log` com o seguinte formato:

```
--pretty=format:%H|||%an|||%ae|||%ad|||%s --date=iso --name-only
```

Decisões de design:
- O separador `|||` entre campos foi escolhido para evitar conflito com vírgulas que podem aparecer em nomes e e-mails de desenvolvedores
- Cada bloco de commit é separado por linha em branco no output do git
- A flag `--name-only` adiciona, após os campos do commit, a lista de arquivos tocados

O parser retorna uma lista de `GitCommit` com os campos: `hash`, `author`, `email`, `date`, `message`, `files[]`.

**Origem:** Sessão [S004] — interação [001]

---

### developer-analysis — perfil por desenvolvedor

Regras de identificação e agregação:

- Desenvolvedores são identificados por **e-mail**, não por nome — evita duplicação por variações de grafia ou troca de nome
- Para cada desenvolvedor é mantido: `totalCommits`, `fileFrequency` (Map<string, number>), `firstCommit`, `lastCommit`
- Ordenação final: por `totalCommits` decrescente (desenvolvedor mais ativo primeiro)

Derivação de `topFiles`:
- O campo `topFiles` não é calculado no módulo de análise — é derivado na tool `analyze_repository` no momento da serialização da resposta
- Critério: top 5 arquivos por frequência de toque (maior `count` primeiro)

**Origem:** Sessão [S004] — interação [001]

---

### domain-analysis — mapeamento de domínios

Algoritmo de extração de domínio a partir do path de cada arquivo tocado:

- O domínio é o **primeiro segmento do path** do arquivo
- Exemplo: `src/core/git/parser.ts` → domínio `src`
- Arquivo na raiz do repositório (sem `/` no path) → domínio `"root"`

Para cada domínio são acumulados: `name`, `path`, `commitCount`, `developers` (Set de e-mails únicos — cada e-mail aparece apenas uma vez por domínio mesmo que o dev tenha vários commits nele).

Ordenação final: por `commitCount` decrescente.

**Origem:** Sessão [S004] — interação [001]

---

## Como aplicar

- O domínio é sempre o primeiro segmento do path — em repositórios com estrutura `src/module/file.ts`, o domínio detectado será `src`, não `module`. Se a granularidade desejada for por módulo, a lógica de `domain-analysis.ts` precisa ser estendida para usar segmentos mais profundos.
- Desenvolvedores são agrupados por e-mail. Commits de um mesmo desenvolvedor com e-mails distintos (ex: pessoal vs corporativo) aparecerão como dois perfis separados. Não há deduplicação por nome.
- Arquivos na raiz do repositório (sem `/` no path) são agrupados no domínio `"root"` — considerar isso ao interpretar domínios de alta atividade.

---

## Histórico de contribuições

| Sessão | Data | O que foi adicionado |
|---|---|---|
| S004 | 2026-05-21 | Criação inicial — git-log-parser, developer-analysis e domain-analysis |
