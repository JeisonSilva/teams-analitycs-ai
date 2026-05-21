import type { GitCommit } from "../git/git-log-parser.js";

export interface DomainArea {
  name: string;
  path: string;
  commitCount: number;
  developers: Set<string>;
}

export function analyzeDomains(commits: GitCommit[]): DomainArea[] {
  const domainMap = new Map<string, DomainArea>();

  for (const commit of commits) {
    for (const file of commit.files) {
      const parts = file.split("/");
      const domain = parts.length > 1 ? parts[0] : "root";

      if (!domainMap.has(domain)) {
        domainMap.set(domain, {
          name: domain,
          path: domain,
          commitCount: 0,
          developers: new Set(),
        });
      }

      const area = domainMap.get(domain)!;
      area.commitCount++;
      area.developers.add(commit.email);
    }
  }

  return Array.from(domainMap.values()).sort(
    (a, b) => b.commitCount - a.commitCount
  );
}
