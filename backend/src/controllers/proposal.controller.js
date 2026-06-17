/*import {
  createProposalService,
  getProposalsService,
  getProposalByIdService,
  updateProposalService,
  deleteProposalService,
} from "../services/proposal.service.js";

import {
  validateCreateProposal,
  validateUpdateProposal,
} from "../validations/proposal.validation.js";

import { parseMonetaryValue } from "../utils/number.util.js";
import { handleError } from "../utils/error.util.js";
import { createdResponse } from "../utils/response.util.js";

// Create Proposal
export const createProposal = async (req, res) => {
  try {
    const userId = req.user.id;

    const { client, title, score } = validateCreateProposal(req.body);
    const value = parseMonetaryValue(req.body.value);
    const status = req.body.status?.trim() || "Draft";

    const proposal = await createProposalService({
      userId,
      client,
      title,
      value,
      status,
      score,
    });

    // Leveraging your response utility
    return createdResponse(res, "Proposal created successfully", { proposal });
  } catch (error) {
    console.error("Create proposal error:", error?.message || error);
    return handleError(res, error);
  }
};

// Get All Proposals
export const getProposals = async (req, res) => {
  try {
    const proposals = await getProposalsService(req.user.id);
    return res.status(200).json(proposals);
  } catch (error) {
    console.error("Get proposals error:", error?.message || error);
    return handleError(res, error);
  }
};

// Get Proposal By ID
export const getProposalById = async (req, res) => {
  try {
    const proposal = await getProposalByIdService(req.params.id, req.user.id);

    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    return res.status(200).json(proposal);
  } catch (error) {
    console.error("Get proposal error:", error?.message || error);
    return handleError(res, error);
  }
};

// Update Proposal
export const updateProposal = async (req, res) => {
  try {
    const validated = validateUpdateProposal(req.body);

    const proposal = await updateProposalService({
      proposalId: req.params.id,
      userId: req.user.id,
      ...validated,
      value: req.body.value !== undefined ? parseMonetaryValue(req.body.value) : undefined,
      status: req.body.status,
    });

    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    return res.status(200).json({
      message: "Proposal updated successfully",
      proposal,
    });
  } catch (error) {
    console.error("Update proposal error:", error?.message || error);
    return handleError(res, error);
  }
};

// Delete Proposal
export const deleteProposal = async (req, res) => {
  try {
    const proposal = await deleteProposalService(req.params.id, req.user.id);

    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    return res.status(200).json({
      message: "Proposal deleted successfully",
      proposal,
    });
  } catch (error) {
    console.error("Delete proposal error:", error?.message || error);
    return handleError(res, error);
  }
};*/
import {
  createProposalService,
  getProposalsService,
  getProposalByIdService,
  updateProposalService,
  deleteProposalService,
} from "../services/proposal.service.js";

import {
  validateCreateProposal,
  validateUpdateProposal,
} from "../validations/proposal.validation.js";

import { parseMonetaryValue } from "../utils/number.util.js";
import { handleError } from "../utils/error.util.js";
import { createdResponse } from "../utils/response.util.js";

// ==========================================
// 1. Create Proposal
// ==========================================
export const createProposal = async (req, res) => {
  try {
    const userId = req.user.id;

    // Your validation function handles throwing the error if fields are invalid
    const validated = validateCreateProposal(req.body);
    
    const value = parseMonetaryValue(req.body.value);
    const status = req.body.status?.trim() || "Draft";

    const proposal = await createProposalService({
      userId,
      value,
      status,
      ...validated, // Spreads cleanly sanitized client, title, and score
    });

    return createdResponse(res, "Proposal created successfully", { proposal });
  } catch (error) {
    console.error("Create proposal error:", error?.message || error);
    return handleError(res, error);
  }
};

// ==========================================
// 2. Update Proposal
// ==========================================
export const updateProposal = async (req, res) => {
  try {
    const validated = validateUpdateProposal(req.body);

    const proposal = await updateProposalService({
      proposalId: req.params.id,
      userId: req.user.id,
      ...validated,
      value: req.body.value !== undefined ? parseMonetaryValue(req.body.value) : undefined,
      status: req.body.status,
    });

    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    return res.status(200).json({
      message: "Proposal updated successfully",
      proposal,
    });
  } catch (error) {
    console.error("Update proposal error:", error?.message || error);
    return handleError(res, error);
  }
};

// ==========================================
// 3. Get All Proposals
// ==========================================
export const getProposals = async (req, res) => {
  try {
    const proposals = await getProposalsService(req.user.id);
    return res.status(200).json(proposals);
  } catch (error) {
    console.error("Get proposals error:", error?.message || error);
    return handleError(res, error);
  }
};

// ==========================================
// 4. Get Proposal By ID
// ==========================================
export const getProposalById = async (req, res) => {
  try {
    const proposal = await getProposalByIdService(req.params.id, req.user.id);

    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    return res.status(200).json(proposal);
  } catch (error) {
    console.error("Get proposal error:", error?.message || error);
    return handleError(res, error);
  }
};

// ==========================================
// 5. Delete Proposal
// ==========================================
export const deleteProposal = async (req, res) => {
  try {
    const proposal = await deleteProposalService(req.params.id, req.user.id);

    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    return res.status(200).json({
      message: "Proposal deleted successfully",
      proposal,
    });
  } catch (error) {
    console.error("Delete proposal error:", error?.message || error);
    return handleError(res, error);
  }
};