import * as shareService from "../services/share.service.js";

// Authenticated Route Handler (The Salesperson triggers this)
export const createLinkAndSendEmail = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { clientEmail, durationDays } = req.body;

    if (!clientEmail) {
      return res.status(400).json({ success: false, message: "Client email is required" });
    }

    const data = await shareService.generateProposalShare({ proposalId, clientEmail, durationDays });
    
    return res.status(201).json({
      success: true,
      message: "Proposal link created and dispatched successfully via Resend",
      data
    });
  } catch (error) {
    console.error("Share endpoint error:", error);
    return res.status(500).json({ success: false, message: "Internal server error configuring token tracking metadata" });
  }
};

// Public Route Handler (The client hits this using the token from the URL)
export const viewPublicProposal = async (req, res) => {
  try {
    const { token } = req.params;
    const data = await shareService.getPublicProposalByToken(token);
    
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Public share view error:", error);
    if (error.message === "Invalid access token specifier") return res.status(404).json({ success: false, message: error.message });
    if (error.message === "This secure proposal link has expired") return res.status(410).json({ success: false, message: error.message });
    
    return res.status(500).json({ success: false, message: "Internal server error fetching asset profile payload" });
  }
};
export const acceptProposalHandler = async (req, res) => {
  try {
    const { token } = req.params;
    const data = await shareService.acceptPublicProposal(token);
    return res.status(200).json({ success: true, message: "Proposal accepted successfully", data });
  } catch (error) {
    console.error("Public accept error:", error);
    if (error.message === "Invalid access token specifier") return res.status(404).json({ success: false, message: error.message });
    if (error.message === "This secure proposal link has expired") return res.status(410).json({ success: false, message: error.message });
    return res.status(500).json({ success: false, message: "Internal server error updating proposal state" });
  }
};

export const rejectProposalHandler = async (req, res) => {
  try {
    const { token } = req.params;
    const data = await shareService.rejectPublicProposal(token);
    return res.status(200).json({ success: true, message: "Proposal rejected successfully", data });
  } catch (error) {
    console.error("Public reject error:", error);
    if (error.message === "Invalid access token specifier") return res.status(404).json({ success: false, message: error.message });
    if (error.message === "This secure proposal link has expired") return res.status(410).json({ success: false, message: error.message });
    return res.status(500).json({ success: false, message: "Internal server error updating proposal state" });
  }
};