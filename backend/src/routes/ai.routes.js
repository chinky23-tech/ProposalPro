import { Router } from "express";
import protect from "../middleware/auth.middleware.js";

import {
  generateDraft,
  improveWinScore,
  applySuggestion,
} from "../controllers/ai.controller.js";

const router = Router();

router.use(protect);

/**
 * @openapi
 * /api/ai/draft:
 *   post:
 *     summary: Generate AI proposal draft
 *     tags:
 *       - AI
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                 brief:
 *                 type: string
 *             example: 
 *                brief: "We need a proposal for a brand refresh project for Northstar Studios, including a new logo, updated website design, and a social media campaign. The client is looking for a modern and creative approach that will help them stand out in the market."
 *     responses:
 *       '200':
 *         description: Successful response
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
router.post("/draft", generateDraft);

/**
 * @openapi
 * /api/ai/improve-score:
 *   post:
 *     summary: Improve proposal win score
 *     tags:
 *       - AI
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - brief
 *             properties:
 *               brief:
 *                 type: string
 *             example: 
 *                brief: "We need a proposal for a brand refresh project for Northstar Studios, including a new logo, updated website design, and a social media campaign. The client is looking for a modern and creative approach that will help them stand out in the market."
 *     responses:
 *       '200':
 *         description: Successful response
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
router.post("/improve-score", improveWinScore);

/**
 * @openapi
 * /api/ai/apply-suggestion:
 *   post:
 *     summary: Apply AI suggestion
 *     tags:
 *       - AI
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - brief
 *               - suggestion
 *             properties:
 *               brief:
 *                 type: string
 *               suggestion:
 *                 type: string
 *             example: 
 *                brief: "We need a proposal for a brand refresh project for Northstar Studios, including a new logo, updated website design, and a social media campaign. The client is looking for a modern and creative approach that will help them stand out in the market."
 *                suggestion: "Consider using more vibrant colors to make the logo stand out."
 *     responses:
 *       '200':
 *         description: Success
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
router.post("/apply-suggestion", applySuggestion);

export default router;