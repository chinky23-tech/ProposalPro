import { Router } from "express";
import protect from "../middleware/auth.middleware.js";

import {
  getSettings,
  updateProfile,
  updateWorkspace,
  updateNotifications,
  updatePassword,
} from "../controllers/settings.controller.js";

const router = Router();

// Protect all routes defined in this router
router.use(protect);

// ==========================================
// Master Settings Endpoint
// ==========================================

/**
 * @openapi
 * /api/settings:
 *   get:
 *     summary: Fetch all user settings (Profile, Workspace, & Notifications)
 *     tags:
 *       - Settings
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Full user settings payload retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", getSettings);

// ==========================================
// Specific Module Update Endpoints
// ==========================================

/**
 * @openapi
 * /api/settings/profile:
 *   put:
 *     summary: Update personal profile settings
 *     tags:
 *       - Settings
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               title:
 *                 type: string
 *                 example: Senior Web Developer
 *               bio:
 *                 type: string
 *                 example: Building web apps with React and Node.js
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation failed
 */
router.put("/profile", updateProfile);

/**
 * @openapi
 * /api/settings/workspace:
 *   put:
 *     summary: Update workspace and proposal branding defaults
 *     tags:
 *       - Settings
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyName
 *             properties:
 *               companyName:
 *                 type: string
 *                 example: ProposalPro Studio
 *               website:
 *                 type: string
 *                 example: https://example.com
 *               brandColor:
 *                 type: string
 *                 example: "#10b981"
 *               defaultCurrency:
 *                 type: string
 *                 example: USD
 *               taxRate:
 *                 type: number
 *                 example: 5.0
 *     responses:
 *       200:
 *         description: Workspace settings updated successfully
 *       400:
 *         description: Validation failed
 */
router.put("/workspace", updateWorkspace);

/**
 * @openapi
 * /api/settings/notifications:
 *   put:
 *     summary: Update notification preferences
 *     tags:
 *       - Settings
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailProposalOpened:
 *                 type: boolean
 *                 example: true
 *               emailProposalAccepted:
 *                 type: boolean
 *                 example: true
 *               emailPaymentReceived:
 *                 type: boolean
 *                 example: true
 *               emailWeeklyDigest:
 *                 type: boolean
 *                 example: false
 *               inAppAlerts:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Notification preferences updated successfully
 */
router.put("/notifications", updateNotifications);

/**
 * @openapi
 * /api/settings/security:
 *   put:
 *     summary: Update account password
 *     tags:
 *       - Settings
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *               newPassword:
 *                 type: string
 *                 format: password
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Current password incorrect or validation failed
 */
router.put("/security", updatePassword);

export default router;