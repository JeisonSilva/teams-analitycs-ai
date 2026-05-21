import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { analyzeRepositorySchema, analyzeRepository } from "./tools/analyze-repository.js";
import { logger } from "../shared/logger.js";

const server = new McpServer({
  name: "teams-analytics-ai",
  version: "0.1.0",
});

server.tool(
  "analyze_repository",
  "Analisa um repositório Git e retorna dados comportamentais: desenvolvedores mais ativos, domínios do projeto, distribuição de commits e (opcionalmente) análise semântica via IA.",
  analyzeRepositorySchema,
  async (input) => {
    const result = await analyzeRepository(input);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

export async function startServer(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  logger.info("teams-analytics-ai MCP server running on stdio");
}
