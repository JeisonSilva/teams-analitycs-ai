# Stack e Estrutura do Projeto

**ID da página:** P002
**Criada em:** 2026-05-20
**Última atualização:** 2026-05-20
**Sessões que contribuíram:** S003

---

## Contexto

Define a stack técnica escolhida para o teams-analitycs-AI e a organização da estrutura de código em camadas, garantindo desacoplamento entre o core de análise e a camada de entrega via MCP.

---

## Conhecimento acumulado

### Stack técnica

| Camada | Tecnologia | Papel |
|---|---|---|
| Linguagem | TypeScript / Node.js | Implementação de todo o projeto |
| Entrega | MCP (Model Context Protocol) | Exposição das capacidades como ferramentas para clientes LLM |
| Orquestração IA | LangChain / LangGraph | Orquestração de agentes e fluxos de raciocínio |
| Modelos | OpenRouter | Acesso a modelos de linguagem |

**Origem:** Sessão [S003] — interação [001]

---

### Estrutura de diretórios

O código-fonte é organizado em três camadas dentro de `src/`:

```
src/
├── core/           # Lógica independente de entrega
│   ├── git/        # Parsing do histórico Git
│   ├── analysis/   # Análises por desenvolvedor e por domínio
│   └── ai/         # Agentes e prompts de IA
├── mcp/            # Servidor e tools MCP
│   ├── server.ts
│   └── tools/
├── shared/         # Configuração e utilitários compartilhados
│   ├── config.ts
│   └── logger.ts
└── index.ts        # Entry point
```

**Origem:** Sessão [S003] — interação [002]

---

### Decisão de arquitetura: core desacoplado da entrega

O `core/` contém toda a lógica de análise sem depender da camada de entrega. Isso garante que o mesmo código possa ser reutilizado em outras frentes além do MCP no futuro (ex: API REST, CLI, outro protocolo). A camada `mcp/` é apenas um adaptador que expõe o core via ferramentas MCP.

**Origem:** Sessão [S003] — interação [002]

---

### Arquivos criados na estrutura inicial

| Arquivo | Responsabilidade |
|---|---|
| `src/core/git/git-log-parser.ts` | Parsing do `git log` em estruturas de dados |
| `src/core/analysis/developer-analysis.ts` | Análise de contribuições por desenvolvedor |
| `src/core/analysis/domain-analysis.ts` | Mapeamento de domínios por caminhos de arquivo |
| `src/core/ai/agents/commit-context-agent.ts` | Agente de contextualização de commits |
| `src/core/ai/prompts/commit-context.ts` | Prompts para o agente de contexto |
| `src/mcp/server.ts` | Servidor MCP |
| `src/mcp/tools/analyze-repository.ts` | Tool MCP `analyze_repository` |
| `src/shared/config.ts` | Configuração centralizada |
| `src/shared/logger.ts` | Utilitário de logging |
| `src/index.ts` | Entry point da aplicação |

**Origem:** Sessão [S003] — interação [002]

---

### Estado de compilação

Após a implementação inicial, o TypeScript foi verificado com `tsc --noEmit` sem erros de compilação.

**Origem:** Sessão [S003] — interação [002]

---

## Histórico de contribuições

| Sessão | Data | O que foi adicionado |
|---|---|---|
| S003 | 2026-05-20 | Criação inicial — stack, estrutura de diretórios, decisão de arquitetura, arquivos criados e estado de compilação |
