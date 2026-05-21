import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { config } from "../../../shared/config.js";
import { commitContextPrompt } from "../prompts/commit-context.js";
import type { DeveloperStats } from "../../analysis/developer-analysis.js";
import type { DomainArea } from "../../analysis/domain-analysis.js";

export interface CommitContextInput {
  repoPath: string;
  developers: DeveloperStats[];
  domains: DomainArea[];
}

export interface CommitContextOutput {
  analysis: string;
}

export async function runCommitContextAgent(
  input: CommitContextInput
): Promise<CommitContextOutput> {
  const model = new ChatOpenAI({
    apiKey: config.openRouter.apiKey,
    configuration: { baseURL: config.openRouter.baseUrl },
    modelName: config.openRouter.model,
    temperature: 0,
  });

  const payload = {
    developers: input.developers.map((d) => ({
      name: d.name,
      email: d.email,
      totalCommits: d.totalCommits,
      topFiles: Array.from(d.fileFrequency.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([file, count]) => ({ file, count })),
      firstCommit: d.firstCommit,
      lastCommit: d.lastCommit,
    })),
    domains: input.domains.map((d) => ({
      name: d.name,
      commitCount: d.commitCount,
      developers: Array.from(d.developers),
    })),
  };

  const response = await model.invoke([
    new SystemMessage(commitContextPrompt),
    new HumanMessage(
      `Dados do repositório:\n\n${JSON.stringify(payload, null, 2)}`
    ),
  ]);

  return { analysis: response.content as string };
}
