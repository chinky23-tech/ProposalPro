import { request } from "./auth";

export const aiApi = {
  generateDraft: ({ brief }, token) =>
    request("/proposals/ai/draft", {
      method: "POST",
      body: { brief },
      token,
    }),

  improveWinScore: ({ brief, currentScore }, token) =>
    request("/proposals/ai/improve-score", {
      method: "POST",
      body: { brief, currentScore },
      token,
    }),

  applySuggestion: ({ brief, suggestion }, token) =>
    request("/proposals/ai/apply-suggestion", {
      method: "POST",
      body: { brief, suggestion },
      token,
    }),
};

export default aiApi;
