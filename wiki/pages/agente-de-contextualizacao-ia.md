# Agente de Contextualização IA

**ID da página:** P005
**Criada em:** 2026-05-21
**Última atualização:** 2026-05-21
**Sessões que contribuíram:** S004

---

## Contexto

O agente de contextualização recebe os dados estruturados de desenvolvedores e domínios e produz um relatório textual interpretando os padrões do time. Ele é acionado pela tool `analyze_repository` quando `useAI=true` e opera exclusivamente sobre dados serializados — não acessa o repositório diretamente.

---

## Conhecimento acumulado

### Integração e modelo

- Utiliza `ChatOpenAI` do LangChain, configurado com a baseURL do **OpenRouter** — não chama a API da OpenAI diretamente
- Temperatura: `0` (respostas determinísticas, sem variação entre execuções)

Variáveis de ambiente necessárias:

| Variável | Obrigatória | Descrição |
|---|---|---|
| `OPENROUTER_API_KEY` | Sim | Chave de acesso ao OpenRouter |
| `OPENROUTER_MODEL` | Não | Modelo a usar (default: `openai/gpt-4o-mini`) |

**Origem:** Sessão [S004] — interação [001]

---

### Payload enviado ao modelo

O agente não repassa todos os dados brutos — envia um subset serializado em JSON:

- Por desenvolvedor: `name`, `email`, `totalCommits`, top **10** arquivos mais tocados (diferente dos top 5 retornados pela tool), `firstCommit`, `lastCommit`
- Por domínio: `name`, `commitCount`, lista de e-mails de developers

Nota: o agente usa top 10 arquivos por desenvolvedor no payload, enquanto a tool retorna top 5 na resposta final ao cliente. São contextos distintos com granularidades diferentes.

**Origem:** Sessão [S004] — interação [001]

---

### Estrutura do prompt do sistema

O prompt instrui o modelo a produzir um relatório dividido em quatro seções:

1. **Domínios e subdomínios identificados** — o que cada área do repositório representa funcionalmente
2. **Perfil dos desenvolvedores** — quem são, onde atuam, nível de engajamento
3. **Grupos por especialização** — desenvolvedores que trabalham nas mesmas áreas formam "times" implícitos
4. **Padrões comportamentais** — concentração de commits, distribuição de responsabilidades, possíveis gargalos

**Origem:** Sessão [S004] — interação [001]

---

### Decisão de design — isolamento do agente

O agente foi projetado para receber apenas dados já processados (JSON serializado), sem acesso direto ao repositório e sem leitura das mensagens de commit completas.

Consequências dessa decisão:
- O agente é independente do ambiente onde o repositório está montado
- A análise semântica é limitada ao que os dados estruturados revelam — padrões de arquivos e volumes, não intenções nos textos dos commits
- Facilita testes unitários do agente, pois o input é determinístico e controlável

**Origem:** Sessão [S004] — interação [001]

---

## Como aplicar

- Para trocar o modelo usado pelo agente, definir `OPENROUTER_MODEL` no `.env`. O padrão é `openai/gpt-4o-mini` — modelos maiores produzem análises mais detalhadas, mas com custo e latência maiores.
- O agente não lê mensagens de commit nem acessa o repositório — a qualidade da análise depende inteiramente dos dados estruturados passados (desenvolvedores e domínios). Quanto mais commits no repositório, mais representativa será a análise.
- O payload enviado ao modelo inclui top 10 arquivos por desenvolvedor (não os 5 da resposta da tool) — isso dá ao agente mais contexto para inferir especialização.
- A temperatura 0 garante respostas determinísticas: para o mesmo repositório, o agente sempre produzirá o mesmo relatório.

---

## Histórico de contribuições

| Sessão | Data | O que foi adicionado |
|---|---|---|
| S004 | 2026-05-21 | Criação inicial — integração, payload, prompt e decisão de design |
