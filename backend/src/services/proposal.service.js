import {
  createProposal,
  getAllProposals,
  getProposalById,
  updateProposal,
  deleteProposal,
  proposalExists,
  updateProposalStatusAdmin
} from "../repositories/proposal.repository.js";

export const createProposalService = async (proposalData) => {
  return await createProposal(proposalData);
};

export const getProposalsService = async (userId) => {
  return await getAllProposals(userId);
};

export const getProposalByIdService = async (proposalId, userId) => {
  return await getProposalById(proposalId, userId);
};

export const updateProposalService = async ({
  proposalId,
  userId,
  client,
  title,
  value,
  status,
  score,
  brief,   // <-- Added brief
  content, // <-- Added content
}) => {
  const existing = await proposalExists(proposalId, userId);

  if (!existing) {
    return null;
  }

  // Clean the incoming status value up front
  const trimmedStatus = status?.trim();

  return await updateProposal({
    proposalId,
    userId,
    client: client ?? existing.client,
    title: title ?? existing.title,
    value: value ?? existing.value,
    score: score ?? existing.score,
    // If trimmedStatus is an empty string or undefined, use existing status
    status: trimmedStatus || existing.status, 
    brief: brief ?? existing.brief,     // <-- Added brief fallback logic
    content: content ?? existing.content, // <-- Added content fallback logic
  });
};

export const deleteProposalService = async (proposalId, userId) => {
  return await deleteProposal(proposalId, userId);
};



/**
 * Closes out a sales cycle as a win
 */
export const markProposalAsWon = async (proposalId, userId) => {
  const updatedProposal = await updateProposalStatusAdmin(proposalId, "Won", userId);
  if (!updatedProposal) {
    throw new Error("Proposal not found or unauthorized access to resource context.");
  }
  return updatedProposal;
};

/**
 * Closes out a sales cycle as a loss
 */
export const markProposalAsLost = async (proposalId, userId) => {
  const updatedProposal = await updateProposalStatusAdmin(proposalId, "Lost", userId);
  if (!updatedProposal) {
    throw new Error("Proposal not found or unauthorized access to resource context.");
  }
  return updatedProposal;
};