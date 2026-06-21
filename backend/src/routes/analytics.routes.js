import { Router } from "express";
import protect from "../middleware/auth.middleware.js";
import { getAnalyticsSummary } from "../controllers/analytics.controller.js";
import { validateAnalyticsQuery } from "../validations/analytics.validation.js";

const router = Router();

// Secure all underlying analytics pathways with the token guard layer
router.use(protect);

/**
 * @openapi
 * /api/analytics:
 *   get:
 *     summary: Get analytics dashboard summary
 *     description: Returns complete proposal lifecycle statistics, revenue metrics, win rates, and deep pipeline distributions for the authenticated user.
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Analytics summaries successfully calculated and extracted.
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
 *                   example: 125000.50
 *                 average_score:
 *                   type: integer
 *                   example: 84
 *                 draft_count:
 *                   type: integer
 *                   example: 4
 *                 review_count:
 *                   type: integer
 *                   example: 2
 *                 sent_count:
 *                   type: integer
 *                   example: 5
 *                 viewed_count:
 *                   type: integer
 *                   example: 6
 *                 accepted_count:
 *                   type: integer
 *                   example: 3
 *                 rejected_count:
 *                   type: integer
 *                   example: 1
 *                 won_count:
 *                   type: integer
 *                   example: 3
 *                 lost_count:
 *                   type: integer
 *                   example: 1
 *                 win_rate:
 *                   type: integer
 *                   example: 60
 *                 status_breakdown:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       status:
 *                         type: string
 *                         example: Viewed
 *                       count:
 *                         type: integer
 *                         example: 6
 *       '401':
 *         description: Unauthorized - Bearer token missing or expired.
 *       '500':
 *         description: Internal Server Error processing metric data streams.
 */
router.get("/", validateAnalyticsQuery, getAnalyticsSummary);

export default router;