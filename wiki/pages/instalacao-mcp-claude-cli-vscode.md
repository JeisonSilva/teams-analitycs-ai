# Instalação de MCP no Claude CLI e VS Code

**ID da página:** P006
**Criada em:** 2026-05-21
**Última atualização:** 2026-05-21
**Sessões que contribuíram:** S005

---

## Contexto

MCP (Model Context Protocol) é o protocolo aberto da Anthropic para conectar modelos de linguagem a ferramentas externas. Um servidor MCP expõe capacidades (tools, resources, prompts) que o cliente — Claude CLI ou VS Code — consome durante a conversa.

---

## Conhecimento acumulado

### Estrutura de configuração

Tanto no CLI quanto no VS Code, a configuração de servidores MCP usa o mesmo formato JSON:

```json
{
  "mcpServers": {
    "nome-do-servidor": {
      "command": "node",
      "args": ["caminho/para/servidor.js"],
      "env": {
        "CHAVE": "valor"
      }
    }
  }
}
```

Para servidores que rodam via HTTP (SSE):

```json
{
  "mcpServers": {
    "nome-do-servidor": {
      "type": "sse",
      "url": "http://localhost:3000/sse"
    }
  }
}
```

**Origem:** Sessão [S005] — autorização explícita do usuário

---

### Instalação no Claude CLI

**Via comando (recomendado):**

```bash
# Adicionar servidor MCP globalmente
claude mcp add nome-do-servidor -- node caminho/para/servidor.js

# Adicionar com variáveis de ambiente
claude mcp add nome-do-servidor -e CHAVE=valor -- node caminho/para/servidor.js

# Adicionar apenas para o projeto atual (escopo local)
claude mcp add nome-do-servidor --scope project -- node caminho/para/servidor.js

# Listar servidores configurados
claude mcp list

# Remover servidor
claude mcp remove nome-do-servidor
```

**Via arquivo de configuração manual:**

Editar `~/.claude/settings.json` (global) ou `.claude/settings.json` (projeto):

```json
{
  "mcpServers": {
    "teams-analitycs": {
      "command": "node",
      "args": ["/caminho/absoluto/para/server.js"]
    }
  }
}
```

**Origem:** Sessão [S005] — autorização explícita do usuário

---

### Instalação no VS Code

**Pré-requisito:** extensão Claude Code instalada no VS Code.

**Via interface gráfica:**
1. Abrir paleta de comandos: `Ctrl+Shift+P` (ou `Cmd+Shift+P` no Mac)
2. Buscar: `Claude: Add MCP Server`
3. Preencher nome, comando e argumentos

**Via arquivo de configuração:**

Para escopo do projeto, criar/editar `.vscode/mcp.json`:

```json
{
  "servers": {
    "nome-do-servidor": {
      "type": "stdio",
      "command": "node",
      "args": ["caminho/para/servidor.js"],
      "env": {
        "CHAVE": "valor"
      }
    }
  }
}
```

Para escopo global, editar `settings.json` do VS Code (`Ctrl+Shift+P` → "Open User Settings (JSON)"):

```json
{
  "mcp": {
    "servers": {
      "nome-do-servidor": {
        "type": "stdio",
        "command": "node",
        "args": ["caminho/para/servidor.js"]
      }
    }
  }
}
```

**Origem:** Sessão [S005] — autorização explícita do usuário

---

### Escopos de configuração (CLI)

| Escopo | Arquivo | Quando usar |
|---|---|---|
| `global` | `~/.claude/settings.json` | Servidor usado em todos os projetos |
| `project` | `.claude/settings.json` | Servidor específico do projeto |
| `local` | `.claude/settings.local.json` | Config pessoal, não versionada |

---

### Verificação após instalação

No Claude CLI:
```bash
claude mcp list                    # lista servidores e status
claude --mcp-debug                 # modo debug para inspecionar comunicação
```

No VS Code: o ícone de ferramentas na barra de status indica quantos servidores MCP estão ativos.

---

## Como aplicar

- Use `claude mcp add` em vez de editar JSON manualmente para evitar erros de sintaxe.
- Prefira escopo `project` (`.claude/settings.json`) para servidores que fazem parte do repositório — assim toda a equipe compartilha a mesma configuração.
- Use escopo `local` para credenciais e caminhos pessoais que não devem ser versionados.
- No VS Code, o arquivo `.vscode/mcp.json` é a forma padrão de versionar servidores MCP junto ao projeto.
- Ao desenvolver um servidor MCP próprio, use `--mcp-debug` no CLI para ver a troca de mensagens em tempo real.

---

## Histórico de contribuições

| Sessão | Data | O que foi adicionado |
|---|---|---|
| S005 | 2026-05-21 | Criação inicial — instalação CLI e VS Code, escopos, verificação |
