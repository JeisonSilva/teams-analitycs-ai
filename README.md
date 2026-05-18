# Teams Analytics AI

Sistema MCP local (Node.js) para análise estatística de projetos de desenvolvimento de software.

Ao clonar um projeto, o MCP analisa o repositório e responde perguntas estratégicas sobre objetivo, qualidade, bugs e contribuição dos desenvolvedores.

---

## Perguntas e Métricas

### Sobre o Projeto

**1. Qual o objetivo do projeto analisado?**
- Leitura do `README.md` do projeto clonado
- Leitura de documentos linkados dentro do README
- Inferência via LLM sobre o conteúdo encontrado
- Se não identificado: retorna mensagem de falha + orientações para melhorar o README

**2. Qual área de negócio ele automatiza?**
- Reutiliza o conteúdo lido na pergunta 1
- Inferência via LLM para classificar o domínio de negócio

**3. Quais contextos são automatizados desta área de negócio?**
- Análise estática da estrutura de pastas, arquivos, módulos e imports
- Construção de um grafo de dependências do projeto
- LLM interpreta os clusters do grafo e nomeia os contextos de negócio

---

### Sobre Qualidade

**4. Este projeto tem qualidade nas entregas?**

*Camada 1 — Testes:*
- Detecta se existe projeto de testes e qual o tipo (unit, integration, e2e)
- LLM gera o comando para executar os testes
- Executa os testes e passa o resultado para a LLM avaliar a cobertura
- Falhas nos testes são consideradas bugs

*Camada 2 — Branches e Tags:*
- Branches com `bug/*` ou `fix/*` como métrica de incidência
- Tags de versão no padrão `major.minor.revision` como métrica de correções aplicadas

**5. Este projeto tem bugs?**
- Issues abertas com label `bug`
- Branches `bug/*` ou `fix/*` não mergeadas
- Falhas na execução dos testes

**6. Quantos bugs foram corrigidos?**
- Issues fechadas com label `bug`
- Branches `bug/*` ou `fix/*` já mergeadas
- Tags com revisão incrementada (ex: `1.0.1 → 1.0.2`)

**7. Quantos bugs ainda existem?**
- Issues abertas com label `bug`
- Branches `bug/*` ou `fix/*` ainda abertas
- Falhas nos testes executados

---

### Sobre Desenvolvimento

**8. Qual contexto está sendo mais importante atualmente?**
- Janela de tempo: últimos 6 meses
- Varre `git log --name-only` para identificar arquivos alterados no período
- Cruza com o grafo de contextos (pergunta 3)
- Contexto com mais arquivos modificados = contexto mais ativo

**9. Quem são os desenvolvedores?**
- Extraído do `git log` — todos os autores com commits no repositório

**10. Quais contextos cada desenvolvedor atua?**
- `git log --name-only` por autor → arquivos commitados
- Cruza arquivos com o grafo de contextos (pergunta 3)
- Resultado: mapa `desenvolvedor → contextos`

**11. Quanto cada desenvolvedor contribui para seus contextos?**
- Volume de commits por desenvolvedor por contexto
- Linhas alteradas (`++` adições e `--` remoções) por contexto
- Frequência de contribuição ao longo do semestre
- As três dimensões combinadas formam o score de contribuição

---

## Arquitetura

- **Tipo:** MCP Server local
- **Runtime:** Node.js
- **Protocolo:** Model Context Protocol (MCP)
- **Fontes de dados:** sistema de arquivos local + `git log`
- **LLM:** inferência via Claude para análise semântica

---

## Fluxo Geral

```
projeto clonado
      ↓
MCP lê README + docs linkados
      ↓
MCP constrói grafo de dependências (pastas, arquivos, imports)
      ↓
MCP executa git log (autores, commits, arquivos, linhas)
      ↓
MCP executa testes do projeto
      ↓
LLM analisa tudo e responde as 11 perguntas
```
