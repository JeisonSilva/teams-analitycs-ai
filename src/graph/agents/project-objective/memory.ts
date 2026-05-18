import { readFile, stat } from "fs/promises";
import { join, resolve } from "path";
import type { LinkedDocument } from "./state.js";

export async function readReadme(repoPath: string): Promise<string | null> {
  try {
    return await readFile(join(repoPath, "README.md"), "utf-8");
  } catch {
    return null;
  }
}

function extractLinks(markdown: string): string[] {
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links = new Set<string>();
  let match: RegExpExecArray | null;

  while ((match = linkPattern.exec(markdown)) !== null) {
    const url = match[2].split(" ")[0]; // remove optional title: [text](url "title")
    if (!url.startsWith("#") && !url.startsWith("mailto:")) {
      links.add(url);
    }
  }

  return [...links];
}

async function fetchLink(url: string, repoPath: string): Promise<string> {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`);
    return await response.text();
  }

  const filePath = resolve(join(repoPath, url));
  const info = await stat(filePath);
  if (info.isDirectory()) throw new Error("path is a directory");
  return await readFile(filePath, "utf-8");
}

export async function resolveLinkedDocuments(
  readmeContent: string,
  repoPath: string
): Promise<{ documents: LinkedDocument[]; errors: string[] }> {
  const links = extractLinks(readmeContent);
  const documents: LinkedDocument[] = [];
  const errors: string[] = [];

  await Promise.allSettled(
    links.map(async (url) => {
      try {
        const content = await fetchLink(url, repoPath);
        documents.push({ url, content, resolvedAt: new Date() });
      } catch (err) {
        errors.push(
          `Could not resolve "${url}": ${err instanceof Error ? err.message : String(err)}`
        );
      }
    })
  );

  return { documents, errors };
}
