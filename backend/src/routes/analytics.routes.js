import { Router } from "express";
import protect from "../middleware/auth.middleware.js";

import {
  getAnalyticsSummary,
} from "../controllers/analytics.controller.js";

const router = Router();

router.use(protect);

/**
 * @openapi
 * /api/analytics:
 *   get:
 *     summary: Get analytics dashboard summary
 *     description: Returns proposal statistics, revenue metrics, average scores, and proposal status breakdown for the authenticated user.
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Analytics summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_proposals:
 *                   type: integer
 *                   example: 25
 *                 total_value:
 *                   type: number
 *                   example: 125000
 *                 average_score:
 *                   type: integer
 *                   example: 84
 *                 sent_count:
 *                   type: integer
 *                   example: 10
 *                 review_count:
 *                   type: integer
 *                   example: 5
 *                 draft_count:
 *                   type: integer
 *                   example: 10
 *                 win_rate:
 *                   type: integer
 *                   example: 40
 *                 status_breakdown:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       status:
 *                         type: string
 *                         example: Draft
 *                       count:
 *                         type: integer
 *                         example: 10
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Server error
 */
router.get("/", getAnalyticsSummary);

export default router;