// MCP uses stdio, so logs must go to stderr to avoid corrupting the protocol
export const logger = {
  info: (...args: unknown[]) => console.error("[INFO]", ...args),
  error: (...args: unknown[]) => console.error("[ERROR]", ...args),
  debug: (...args: unknown[]) => console.error("[DEBUG]", ...args),
};
