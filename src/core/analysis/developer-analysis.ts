import type { GitCommit } from "../git/git-log-parser.js";

export interface DeveloperStats {
  name: string;
  email: string;
  totalCommits: number;
  fileFrequency: Map<string, number>;
  firstCommit: string;
  lastCommit: string;
}

export function analyzeDevelopers(commits: GitCommit[]): DeveloperStats[] {
  const devMap = new Map<string, DeveloperStats>();

  for (const commit of commits) {
    if (!devMap.has(commit.email)) {
      devMap.set(commit.email, {
        name: commit.author,
        email: commit.email,
        totalCommits: 0,
        fileFrequency: new Map(),
        firstCommit: commit.date,
        lastCommit: commit.date,
      });
    }

    const dev = devMap.get(commit.email)!;
    dev.totalCommits++;
    dev.lastCommit = commit.date;

    for (const file of commit.files) {
      dev.fileFrequency.set(file, (dev.fileFrequency.get(file) ?? 0) + 1);
    }
  }

  return Array.from(devMap.values()).sort(
    (a, b) => b.totalCommits - a.totalCommits
  );
}
