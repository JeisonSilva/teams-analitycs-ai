# Tool MCP analyze_repository

**ID da página:** P003
**Criada em:** 2026-05-21
**Última atualização:** 2026-05-21
**Sessões que contribuíram:** S004

---

## Contexto

A tool `analyze_repository` é a interface principal do servidor MCP, expondo a análise de repositórios Git como ferramenta consumível por clientes LLM como o Claude Desktop. Ela opera em dois modos — estático e com IA — e é o ponto de entrada para toda a inteligência extraída do repositório.

---

## Conhecimento acumulado

### Parâmetros de entrada

A tool aceita dois parâmetros:

- `repoPath` (string, obrigatório) — caminho absoluto para o repositório Git a ser analisado
- `useAI` (boolean, opcional, default: `false`) — ativa análise semântica via IA quando `true`

**Origem:** Sessão [S004] — interação [001]

---

### Dois modos de operação

**Modo estático (`useAI=false`):** retorna dados brutos estruturados — totalCommits, lista de developers e lista de domains. Não depende de chave de API externa.

**Modo IA (`useAI=true`):** executa o agente de contextualização após a coleta dos dados brutos e adiciona o campo `aiAnalysis` ao resultado. Requer configuração de `OPENROUTER_API_KEY` e `OPENROUTER_MODEL`.

**Origem:** Sessão [S004] — interação [001]

---

### Estrutura de saída — modo estático

```json
{
  "totalCommits": number,
  "developers": [
    {
      "name": string,
      "email": string,
      "totalCommits": number,
      "firstCommit": string,
      "lastCommit": string,
      "topFiles": [{ "file": string, "count": number }]
    }
  ],
  "domains": [
    {
      "name": string,
      "commitCount": number,
      "developers": string[]
    }
  ]
}
```

Notas:
- `firstCommit` e `lastCommit` estão em formato ISO date
- `topFiles` contém os 5 arquivos mais tocados pelo desenvolvedor (top 5 derivado na tool)
- `developers` em `domains` é lista de e-mails únicos

**Origem:** Sessão [S004] — interação [001]

---

### Saída adicional no modo IA

Quando `useAI=true`, o resultado inclui o campo `aiAnalysis` (string) contendo o relatório textual produzido pelo agente de contextualização. O restante da estrutura permanece idêntico ao modo estático.

**Origem:** Sessão [S004] — interação [001]

---

## Como aplicar

- Para analisar um repositório sem custo de API: chamar a tool com `useAI: false` (padrão). Útil para exploração inicial ou quando a chave OpenRouter não está configurada.
- Para obter interpretação textual dos padrões do time: chamar com `useAI: true`. Requer `OPENROUTER_API_KEY` configurada no ambiente.
- O campo `topFiles` retorna apenas os 5 arquivos mais tocados por desenvolvedor — suficiente para identificar especialização, mas não representa o histórico completo de arquivos.
- A lista `developers` em `domains` contém e-mails, não nomes — use `developers[].email` para cruzar com os dados de `developers[]` na raiz.

---

## Histórico de contribuições

| Sessão | Data | O que foi adicionado |
|---|---|---|
| S004 | 2026-05-21 | Criação inicial — parâmetros, modos de operação e estrutura de saída |
