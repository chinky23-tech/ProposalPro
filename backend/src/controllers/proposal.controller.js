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
import { createNotificationService } from "../services/notifications.service.js";

// ==========================================
// 1. Create Proposal
// ==========================================
export const createProposal = async (req, res) => {
  try {
    const userId = req.user.id;

    // Validation handles throwing error if fields are invalid
    const validated = validateCreateProposal(req.body);
    
    const value = parseMonetaryValue(req.body.value);
    const status = req.body.status?.trim() || "Draft";

    const proposal = await createProposalService({
      userId,
      value,
      status,
      ...validated, // Spreads sanitized client, title, score
    });

    // Notify user on creation
    await createNotificationService(userId, {
      proposalId: proposal.id,
      title: "Proposal Created",
      message: `Proposal "${proposal.title || 'Untitled'}" was successfully created.`,
      type: "proposal_created",
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

    // Trigger notification if status changed via general update
    if (req.body.status) {
      await createNotificationService(req.user.id, {
        proposalId: proposal.id,
        title: "Proposal Updated",
        message: `Proposal "${proposal.title}" status changed to ${req.body.status}.`,
        type: `proposal_${req.body.status.toLowerCase()}`,
      });
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

// ==========================================
// 6. Mark Proposal As Won
// ==========================================
export const handleMarkAsWon = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const data = await markProposalAsWon(id, userId); 

    // Create WON notification
    await createNotificationService(userId, {
      proposalId: id,
      title: "Deal Won! 🎉",
      message: `Proposal "${data?.title || 'Proposal'}" was officially marked as WON.`,
      type: "proposal_won",
    });

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

// ==========================================
// 7. Mark Proposal As Lost
// ==========================================
export const handleMarkAsLost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const data = await markProposalAsLost(id, userId); 

    // Create LOST notification
    await createNotificationService(userId, {
      proposalId: id,
      title: "Proposal Marked as Lost",
      message: `Proposal "${data?.title || 'Proposal'}" was logged as LOST.`,
      type: "proposal_lost",
    });

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

// ==========================================
// 8. Public Link Opened by Client
// ==========================================
export const viewPublicProposal = async (req, res) => {
  try {
    const proposal = await getProposalByToken(req.params.token);

    if (!proposal) {
      return res.status(404).json({ success: false, message: "Proposal not found" });
    }

    // Track that it was opened and notify the proposal owner
    await createNotificationService(proposal.user_id, {
      proposalId: proposal.id,
      title: "Proposal Opened",
      message: `A client opened proposal "${proposal.title}"`,
      type: "proposal_viewed",
    });

    return res.status(200).json({ success: true, data: proposal });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 9. Update Status (Accepted / Won / Sent)
// ==========================================
export const updateProposalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // e.g. 'accepted', 'won', 'sent'

    const proposal = await updateProposalStatusService(id, status);

    if (!proposal) {
      return res.status(404).json({ success: false, message: "Proposal not found" });
    }

    // Send notifications based on status change
    if (status === "accepted") {
      await createNotificationService(proposal.user_id, {
        proposalId: proposal.id,
        title: "Proposal Accepted!",
        message: `Proposal "${proposal.title}" was accepted and signed by the client.`,
        type: "proposal_accepted",
      });
    } else if (status === "won") {
      await createNotificationService(proposal.user_id, {
        proposalId: proposal.id,
        title: "Deal Won! 🎉",
        message: `Proposal "${proposal.title}" was marked as won.`,
        type: "proposal_won",
      });
    } else if (status === "sent") {
      await createNotificationService(proposal.user_id, {
        proposalId: proposal.id,
        title: "Proposal Sent",
        message: `Proposal "${proposal.title}" has been sent to client.`,
        type: "proposal_sent",
      });
    }

    return res.status(200).json({ success: true, data: proposal });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};