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
 *               brief:
 *                 type: string
 *                 example: A brief description of the proposal
 *               content:
 *                 type: string
 *                 example: Detailed content of the proposal
 *     responses:
 *       201:
 *         description: Proposal created successfully
 *       400:
 *         description: Invalid input validation
 *       401:
 *         description: Unauthorized access
 *   get:
 *     summary: Get all proposals
 *     tags:
 *       - Proposals
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of proposals
 *       401:
 *         description: Unauthorized access
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
 *           type: string
 *     responses:
 *       200:
 *         description: Proposal details found
 *       404:
 *         description: Proposal not found
 *       401:
 *         description: Unauthorized access
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
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               client:
 *                 type: string
 *               title:
 *                 type: string
 *               value:
 *                 type: number
 *               status:
 *                 type: string
 *               score:
 *                 type: integer
 *               brief:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Proposal updated successfully
 *       404:
 *         description: Proposal not found
 *       401:
 *         description: Unauthorized access
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
 *           type: string
 *     responses:
 *       200:
 *         description: Proposal deleted successfully
 *       404:
 *         description: Proposal not found
 *       401:
 *         description: Unauthorized access
 */
  router.route("/:id")
  .get(getProposalById)
  .put(updateProposal)
  .delete(deleteProposal);

export default router;
