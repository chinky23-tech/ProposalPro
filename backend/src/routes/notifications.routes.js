import { Router } from "express";
import protect from "../middleware/auth.middleware.js";
import {
  getNotifications,
  markAllAsRead,
  markAsRead,
} from "../controllers/notifications.controller.js";

const router = Router();

// Protect all notification routes
router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: In-app notification management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         proposalId:
 *           type: integer
 *           nullable: true
 *           example: 42
 *         title:
 *           type: string
 *           example: "Proposal Viewed"
 *         message:
 *           type: string
 *           example: "Client opened proposal 'Website Redesign'"
 *         type:
 *           type: string
 *           example: "proposal_viewed"
 *         isRead:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2026-08-01T18:00:00.000Z"
 *     NotificationResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             notifications:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *             unreadCount:
 *               type: integer
 *               example: 3
 */

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get user notifications
 *     description: Fetch recent notifications and unread count for the authenticated user.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of notifications fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotificationResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */
router.get("/", getNotifications);

/**
 * @swagger
 * /api/notifications/read-all:
 *   put:
 *     summary: Mark all notifications as read
 *     description: Updates all unread notifications for the logged-in user to read state.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read successfully.
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
 *                   example: "All notifications marked as read"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
router.put("/read-all", markAllAsRead);

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   put:
 *     summary: Mark a single notification as read
 *     description: Marks a specific notification as read by its ID.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the notification to mark as read.
 *         example: 1
 *     responses:
 *       200:
 *         description: Notification marked as read successfully.
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
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     isRead:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Invalid notification ID.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Notification not found.
 *       500:
 *         description: Internal server error.
 */
router.put("/:id/read", markAsRead);

export default router;