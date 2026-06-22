import * as shareRepository from "../repositories/share.repository.js";
import crypto from "crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const generateProposalShare = async ({ proposalId, clientEmail, durationDays = 30 }) => {
  const token = crypto.randomBytes(16).toString("hex");
  
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + durationDays);

  const shareRecord = await shareRepository.createShare({ proposalId, token, expiresAt });

  // 🟢 AUTOMATION TRIGGER 1: Advance state from Draft/Review to Sent
  await shareRepository.updateProposalStatus(proposalId, "Sent");

  const shareUrl = `https://proposalpro.ai/p/${token}`;

  await resend.emails.send({
    from: "ProposalPro <proposals@resend.dev>",
    to: clientEmail,
    subject: "You have received a new business proposal!",
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2>New Proposal Ready For Review</h2>
        <p>Hello,</p>
        <p>A new digital business proposal has been created for you. Click the secure layout access link down below to inspect details directly without requiring registration or authorization parameters:</p>
        <div style="margin: 30px 0;">
          <a href="${shareUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Proposal</a>
        </div>
        <p style="font-size: 12px; color: #666;">This secure proposal tracking target link stays operational until: ${expiresAt.toLocaleDateString()}</p>
      </div>
    `,
  });

  return { shareUrl, expiresAt };
};

export const getPublicProposalByToken = async (token) => {
  const sharedAsset = await shareRepository.findByToken(token);
  if (!sharedAsset) throw new Error("Invalid access token specifier");

  if (new Date() > new Date(sharedAsset.expires_at)) {
    throw new Error("This secure proposal link has expired");
  }

  await shareRepository.incrementViewCount(token);

  // 🟢 AUTOMATION TRIGGER 2: Only update to 'Viewed' if it was sitting at 'Sent'
  if (sharedAsset.status === "Sent") {
    await shareRepository.updateProposalStatus(sharedAsset.proposal_id, "Viewed");
  }

  return {
    title: sharedAsset.proposal_title,
    content: sharedAsset.proposal_content,
    viewCount: sharedAsset.view_count + 1
  };
};
/**
 * Public action to accept a proposal via its tracking token
 */
export const acceptPublicProposal = async (token) => {
  const sharedAsset = await shareRepository.findByToken(token);
  if (!sharedAsset) throw new Error("Invalid access token specifier");
  if (new Date() > new Date(sharedAsset.expires_at)) throw new Error("This secure proposal link has expired");

  // Advance status to 'Accepted'
  await shareRepository.updateProposalStatus(sharedAsset.proposal_id, "Accepted");
  return { title: sharedAsset.proposal_title, status: "Accepted" };
};

/**
 * Public action to decline/reject a proposal via its tracking token
 */
export const rejectPublicProposal = async (token) => {
  const sharedAsset = await shareRepository.findByToken(token);
  if (!sharedAsset) throw new Error("Invalid access token specifier");
  if (new Date() > new Date(sharedAsset.expires_at)) throw new Error("This secure proposal link has expired");

  // Advance status to 'Rejected'
  await shareRepository.updateProposalStatus(sharedAsset.proposal_id, "Rejected");
  return { title: sharedAsset.proposal_title, status: "Rejected" };
};