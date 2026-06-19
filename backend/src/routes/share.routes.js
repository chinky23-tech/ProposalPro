import { Router } from "express";
import { createLinkAndSendEmail, viewPublicProposal } from "../controllers/share.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Proposal Sharing
 *   description: API operations for managing secure public proposal link distributions and tracking.
 */

/**
 * @swagger
 * /api/proposals/{proposalId}/share:
 *   post:
 *     summary: Generate a secure share link and dispatch it to a client via Resend
 *     tags: [Proposal Sharing]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: proposalId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the proposal to be shared.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientEmail
 *             properties:
 *               clientEmail:
 *                 type: string
 *                 format: email
 *                 example: client@example.com
 *                 description: The recipient email address for the proposal layout link.
 *               durationDays:
 *                 type: integer
 *                 default: 30
 *                 example: 14
 *                 description: The structural lifespan limit configuration of the share token in days.
 *     responses:
 *       201:
 *         description: Share token saved and email successfully fired via Resend.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Proposal link created and dispatched successfully via Resend
 *                 data:
 *                   type: object
 *                   properties:
 *                     shareUrl:
 *                       type: string
 *                       example: https://proposalpro.ai/p/abc123xyz789
 *                     expiresAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-07-19T12:00:00.000Z"
 *       400:
 *         description: Invalid parameters or email omitted from the body payload.
 *       401:
 *         description: Missing or malformed Bearer Token (Unauthorized access protection layer).
 *       500:
 *         description: Internal server error processing email structures or SQL storage arrays.
 */
router.post("/proposals/:proposalId/share", protect, createLinkAndSendEmail);

/**
 * @swagger
 * /api/public/proposals/share/{token}:
 *   get:
 *     summary: Fetch basic proposal layout configuration elements using an unauthenticated public token string
 *     description: Accessible without a dashboard authorization token. Automatically tracks hits by incrementing the asset row's view counter.
 *     tags: [Proposal Sharing]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The secure unguessable random string token from the shared URL matrix.
 *     responses:
 *       200:
 *         description: Asset located successfully. Returns payload structures cleanly.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: Enterprise Software Architecture Proposal
 *                     content:
 *                       type: object
 *                       example: { sections: [...] }
 *                     viewCount:
 *                       type: integer
 *                       example: 5
 *       404:
 *         description: Invalid access token specifier. Token does not exist in database record architecture.
 *       410:
 *         description: Lifespan limit constraint exceeded. This secure proposal link has expired.
 *       500:
 *         description: Internal server error gathering infrastructure mapping metadata.
 */
router.get("/public/proposals/share/:token", viewPublicProposal);

export default router;