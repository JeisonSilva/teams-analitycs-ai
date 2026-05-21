import { execSync } from "child_process";

export interface GitCommit {
  hash: string;
  author: string;
  email: string;
  date: string;
  message: string;
  files: string[];
}

const SEP = "|||";

export function parseGitLog(repoPath: string): GitCommit[] {
  const format = `--pretty=format:%H${SEP}%an${SEP}%ae${SEP}%ad${SEP}%s`;

  const output = execSync(
    `git -C "${repoPath}" log ${format} --date=iso --name-only`,
    { encoding: "utf-8" }
  );

  return parseOutput(output);
}

function parseOutput(output: string): GitCommit[] {
  const commits: GitCommit[] = [];
  const blocks = output.trim().split(/\n\n+/);

  for (const block of blocks) {
    const lines = block.trim().split("\n");
    if (!lines[0]) continue;

    const parts = lines[0].split(SEP);
    if (parts.length < 5) continue;

    const [hash, author, email, date, ...msgParts] = parts;
    const message = msgParts.join(SEP);
    const files = lines.slice(1).filter(Boolean);

    commits.push({ hash, author, email, date, message, files });
  }

  return commits;
}
