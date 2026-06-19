import * as shareRepository from "../repositories/share.repository.js";
import crypto from "crypto";
import { Resend } from "resend";

// Initialize Resend with your environment variable
const resend = new Resend(process.env.RESEND_API_KEY);

export const generateProposalShare = async ({ proposalId, clientEmail, durationDays = 30 }) => {
  // 1. Generate a secure, unguessable URL-safe random string token
  const token = crypto.randomBytes(16).toString("hex");
  
  // 2. Set lifetime limit constraints
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + durationDays);

  // 3. Persist record inside PostgreSQL
  const shareRecord = await shareRepository.createShare({ proposalId, token, expiresAt });

  // 4. Construct Public-facing web link wrapper
  const shareUrl = `https://proposalpro.ai/p/${token}`;

  // 5. Fire transaction dispatch payload using Resend
  await resend.emails.send({
    from: "ProposalPro <proposals@resend.dev>", // Resend sandbox fallback address
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

  // Check if link lifetime limit threshold has been surpassed
  if (new Date() > new Date(sharedAsset.expires_at)) {
    throw new Error("This secure proposal link has expired");
  }

  // Analytics increment check
  await shareRepository.incrementViewCount(token);

  return {
    title: sharedAsset.proposal_title,
    content: sharedAsset.proposal_content,
    viewCount: sharedAsset.view_count + 1
  };
};