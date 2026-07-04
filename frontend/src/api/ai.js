import { request } from "./auth";

export const aiApi = {
  generateDraft: ({ brief }, token) =>
    request("/ai/draft", {
      method: "POST",
      body: { brief },
      token,
    }),

  improveWinScore: ({ brief, currentScore }, token) =>
    request("/ai/improve-score", {
      method: "POST",
      body: { brief, currentScore },
      token,
    }),

  applySuggestion: ({ brief, suggestion }, token) =>
    request("/ai/apply-suggestion", {
      method: "POST",
      body: { brief, suggestion },
      token,
    }),
};

export default aiApi;
