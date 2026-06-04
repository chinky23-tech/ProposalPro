import { request } from "./auth";

export const proposalsApi = {
  getProposals: (token) =>
    request("/proposals", {
      token,
    }),

  getProposalById: (id, token) =>
    request(`/proposals/${id}`, {
      token,
    }),

  createProposal: (proposal, token) =>
    request("/proposals", {
      method: "POST",
      body: proposal,
      token,
    }),

  updateProposal: (id, proposal, token) =>
    request(`/proposals/${id}`, {
      method: "PUT",
      body: proposal,
      token,
    }),

  deleteProposal: (id, token) =>
    request(`/proposals/${id}`, {
      method: "DELETE",
      token,
    }),

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

  applySuggestion: ({ suggestion }, token) =>
    request("/proposals/ai/apply-suggestion", {
      method: "POST",
      body: { suggestion },
      token,
    }),

  getClients: (token) =>
    request("/proposals/clients", {
      token,
    }),

  getAnalytics: (token) =>
    request("/proposals/analytics", {
      token,
    }),
};
export default proposalsApi;
