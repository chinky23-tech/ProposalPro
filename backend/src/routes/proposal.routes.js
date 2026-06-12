import { Router } from "express";
import protect from "../middleware/auth.middleware.js";

import {
  createProposal,
  getProposals,
  getProposalById,
  updateProposal,
  deleteProposal,
} from "../controllers/proposal.controller.js";

const router = Router();

router.use(protect);

/**
 * @openapi
 * /api/proposals:
 *   post:
 *     summary: Create a new proposal
 *     tags:
 *       - Proposals
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - client
 *               - title
 *             properties:
 *               client:
 *                 type: string
 *                 example: Northstar Studios
 *               title:
 *                 type: string
 *                 example: Brand Refresh Proposal
 *               value:
 *                 type: number
 *                 example: 25000
 *               status:
 *                 type: string
 *                 example: Draft
 *               score:
 *                 type: integer
 *                 example: 85
 *   get:
 *     summary: Get all proposals
 *     tags:
 *       - Proposals
 *     security:
 *       - bearerAuth: []
 */
router.route("/")
  .post(createProposal)
  .get(getProposals);

/**
 * @openapi
 * /api/proposals/{id}:
 *   get:
 *     summary: Get proposal by ID
 *     tags:
 *       - Proposals
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *   put:
 *     summary: Update proposal
 *     tags:
 *       - Proposals
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *   delete:
 *     summary: Delete proposal
 *     tags:
 *       - Proposals
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.route("/:id")
  .get(getProposalById)
  .put(updateProposal)
  .delete(deleteProposal);

export default router;