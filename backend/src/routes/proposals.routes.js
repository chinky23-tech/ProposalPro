import { Router } from "express";
import {
  applySuggestion,
  createProposal,
  generateDraft,
  getAnalyticsSummary,
  getClientsSummary,
  getProposals,
  getProposalById,
  improveWinScore,
  updateProposal,
  deleteProposal
} from "../controllers/proposals.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = Router();

// Apply authentication middleware to all routes in this router
router.use(protect);

router.post("/ai/draft", generateDraft);
router.post("/ai/improve-score", improveWinScore);
router.post("/ai/apply-suggestion", applySuggestion);
router.get("/clients", getClientsSummary);
router.get("/analytics", getAnalyticsSummary);

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
 *                 example: Brand refresh and launch plan
 *               value:
 *                 type: number
 *                 format: float
 *                 example: 18400.00
 *               status:
 *                 type: string
 *                 example: Draft
 *               score:
 *                 type: integer
 *                 example: 91
 *     responses:
 *       201:
 *         description: Proposal created successfully
 *       400:
 *         description: Invalid input or missing fields
 *       401:
 *         description: Unauthorized
 * 
 *   get:
 *     summary: Retrieve all proposals for the authenticated user
 *     tags:
 *       - Proposals
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of proposals
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   user_id:
 *                     type: integer
 *                   client:
 *                     type: string
 *                   title:
 *                     type: string
 *                   value:
 *                     type: string
 *                   status:
 *                     type: string
 *                   score:
 *                     type: integer
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 */
router.route("/")
  .post(createProposal)
  .get(getProposals);

/**
 * @openapi
 * /api/proposals/{id}:
 *   get:
 *     summary: Get a single proposal by ID
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
 *         description: The proposal ID
 *     responses:
 *       200:
 *         description: Proposal details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Proposal not found
 * 
 *   put:
 *     summary: Update a proposal by ID
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
 *         description: The proposal ID
 *     requestBody:
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
 *     responses:
 *       200:
 *         description: Proposal updated successfully
 *       400:
 *         description: Invalid inputs
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Proposal not found
 * 
 *   delete:
 *     summary: Delete a proposal by ID
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
 *         description: The proposal ID
 *     responses:
 *       200:
 *         description: Proposal deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Proposal not found
 */
router.route("/:id")
  .get(getProposalById)
  .put(updateProposal)
  .delete(deleteProposal);

export default router;
