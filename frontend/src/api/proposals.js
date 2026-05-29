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
};
export default proposalsApi;
