import "dotenv/config";

export const config = {
  openRouter: {
    apiKey: process.env.OPENROUTER_API_KEY ?? "",
    baseUrl: "https://openrouter.ai/api/v1",
    model: process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini",
  },
};
