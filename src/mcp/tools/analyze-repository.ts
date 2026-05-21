import { z } from "zod";
import { parseGitLog } from "../../core/git/git-log-parser.js";
import { analyzeDevelopers } from "../../core/analysis/developer-analysis.js";
import { analyzeDomains } from "../../core/analysis/domain-analysis.js";
import { runCommitContextAgent } from "../../core/ai/agents/commit-context-agent.js";

export const analyzeRepositorySchema = {
  repoPath: z.string().describe("Caminho absoluto para o repositório Git a ser analisado"),
  useAI: z
    .boolean()
    .optional()
    .default(false)
    .describe("Ativa análise semântica via IA para extrair domínios e grupos de desenvolvedores"),
};

export async function analyzeRepository(input: {
  repoPath: string;
  useAI?: boolean;
}) {
  const commits = parseGitLog(input.repoPath);
  const developers = analyzeDevelopers(commits);
  const domains = analyzeDomains(commits);

  const baseResult = {
    totalCommits: commits.length,
    developers: developers.map((d) => ({
      name: d.name,
      email: d.email,
      totalCommits: d.totalCommits,
      firstCommit: d.firstCommit,
      lastCommit: d.lastCommit,
      topFiles: Array.from(d.fileFrequency.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([file, count]) => ({ file, count })),
    })),
    domains: domains.map((d) => ({
      name: d.name,
      commitCount: d.commitCount,
      developers: Array.from(d.developers),
    })),
  };

  if (!input.useAI) {
    return baseResult;
  }

  const { analysis } = await runCommitContextAgent({
    repoPath: input.repoPath,
    developers,
    domains,
  });

  return { ...baseResult, aiAnalysis: analysis };
}
