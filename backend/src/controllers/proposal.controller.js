import {
  createProposalService,
  getProposalsService,
  getProposalByIdService,
  updateProposalService,
  deleteProposalService,
  markProposalAsWon,   
  markProposalAsLost,  
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


export const handleMarkAsWon = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    
    const data = await markProposalAsWon(id, userId); 
    return res.status(200).json({
      success: true,
      message: "Congratulations! Proposal has been officially closed out as WON.",
      data
    });
  } catch (error) {
    console.error("Admin Won endpoint failure:", error);
    if (error.message.includes("not found")) return res.status(404).json({ success: false, message: error.message });
    return res.status(500).json({ success: false, message: "Internal server error archiving deal milestone." });
  }
};

export const handleMarkAsLost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const data = await markProposalAsLost(id, userId); 
    return res.status(200).json({
      success: true,
      message: "Proposal has been logged as LOST. Optimization insights updated.",
      data
    });
  } catch (error) {
    console.error("Admin Lost endpoint failure:", error);
    if (error.message.includes("not found")) return res.status(404).json({ success: false, message: error.message });
    return res.status(500).json({ success: false, message: "Internal server error archiving deal milestone." });
  }
};