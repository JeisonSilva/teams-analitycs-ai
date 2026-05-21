# Visão Geral do Projeto

**ID da página:** P001
**Criada em:** 2026-05-20
**Última atualização:** 2026-05-20
**Sessões que contribuíram:** S003

---

## Contexto

O teams-analitycs-AI é uma plataforma de análise comportamental de repositórios Git que usa IA para extrair inteligência sobre como times de desenvolvimento constroem e mantêm produtos de software. O projeto elimina a necessidade de análise manual de repositórios, automatizando a extração de padrões de comportamento a partir do histórico de commits.

---

## Conhecimento acumulado

### Problema que o projeto resolve

Times de desenvolvimento precisam extrair inteligência de repositórios Git de forma manual. O projeto automatiza esse processo, usando IA para identificar padrões comportamentais e de organização que seriam invisíveis ou trabalhosos de obter manualmente.

**Origem:** Sessão [S003] — interação [001]

---

### Usuários-alvo

Dois perfis principais:

- **Engenheiros de Software** — que querem entender a distribuição de trabalho, especialização por domínio e padrões de colaboração no time.
- **Gerentes e Tech Leads** — que precisam de visibilidade sobre engajamento, saúde do repositório e dinâmicas do time.

**Origem:** Sessão [S003] — interação [001]

---

### Capacidades principais

- Mapeamento de domínios de código a partir dos caminhos de arquivos tocados por cada desenvolvedor
- Análise por desenvolvedor: volume de contribuição, áreas de especialização, frequência
- Agrupamento de desenvolvedores por especialização
- Métricas de engajamento do time ao longo do tempo

**Origem:** Sessão [S003] — interação [001]

---

### Forma de entrega

O projeto é entregue como um servidor MCP (Model Context Protocol), o que permite que clientes compatíveis com MCP — como o Claude Desktop — consumam as capacidades de análise diretamente como ferramentas. O core é desacoplado da camada MCP para suportar múltiplas frentes de entrega no futuro.

**Origem:** Sessão [S003] — interação [001]

---

## Histórico de contribuições

| Sessão | Data | O que foi adicionado |
|---|---|---|
| S003 | 2026-05-20 | Criação inicial — definição do projeto, usuários-alvo, capacidades e forma de entrega |
