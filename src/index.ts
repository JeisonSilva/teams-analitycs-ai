import { startServer } from "./mcp/server.js";

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
