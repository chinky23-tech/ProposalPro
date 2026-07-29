import express, { Router } from "express";
import protect from "../middleware/auth.middleware.js";

import {
  createBilling,
  getBilling,
  getBillingById,
  updateBilling,
  deleteBilling,
  getSubscriptionStatus,
  createCheckoutSession,
  createCustomerPortal,
  handleStripeWebhook,
} from "../controllers/billing.controller.js";

import { validateBillingIdParam } from "../validations/billing.validation.js";

const router = Router();

// ==========================================
// Public Webhook Route (Must remain BEFORE auth middleware)
// ==========================================
router.post(
  "/webhook", 
  express.raw({ type: "application/json" }), 
  handleStripeWebhook
);

// Protect all routes defined below this line
router.use(protect);

// ==========================================
// Subscription & Stripe Endpoints
// ==========================================

/**
 * @openapi
 * /api/billing/subscription:
 *   get:
 *     summary: Get active subscription status and AI quotas
 *     tags:
 *       - Billing
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active subscription details and AI usage limits
 */
router.get("/subscription", getSubscriptionStatus);

/**
 * @openapi
 * /api/billing/checkout-session:
 *   post:
 *     summary: Create a Stripe Checkout Session
 *     tags:
 *       - Billing
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - priceId
 *             properties:
 *               priceId:
 *                 type: string
 *               successUrl:
 *                 type: string
 *               cancelUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Checkout session URL returned successfully
 */
router.post("/checkout-session", createCheckoutSession);

/**
 * @openapi
 * /api/billing/customer-portal:
 *   post:
 *     summary: Create a Stripe Customer Portal Link
 *     tags:
 *       - Billing
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               returnUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Portal URL returned successfully
 */
router.post("/customer-portal", createCustomerPortal);

// ==========================================
// Base CRUD Endpoints
// ==========================================

/**
 * @openapi
 * /api/billing:
 *   post:
 *     summary: Create a billing record
 *     tags:
 *       - Billing
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - plan
 *               - amount
 *             properties:
 *               plan:
 *                 type: string
 *                 example: Professional
 *               amount:
 *                 type: number
 *                 example: 99
 *               currency:
 *                 type: string
 *                 example: USD
 *               status:
 *                 type: string
 *                 example: Paid
 *               paymentMethod:
 *                 type: string
 *                 example: Stripe
 *               billingDate:
 *                 type: string
 *                 format: date
 *               nextBillingDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Billing created successfully
 *       400:
 *         description: Validation failed
 *
 *   get:
 *     summary: Get all billing records
 *     tags:
 *       - Billing
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of billing records
 */
router
  .route("/")
  .post(createBilling)
  .get(getBilling);

// ==========================================
// Parameterized ID Endpoints (Kept at bottom to prevent wildcard collision)
// ==========================================

/**
 * @openapi
 * /api/billing/{id}:
 *   get:
 *     summary: Get billing record by ID
 *     tags:
 *       - Billing
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
 *         description: Billing record found
 *       404:
 *         description: Billing record not found
 *
 *   put:
 *     summary: Update billing record
 *     tags:
 *       - Billing
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
 *     responses:
 *       200:
 *         description: Billing updated successfully
 *
 *   delete:
 *     summary: Delete billing record
 *     tags:
 *       - Billing
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
 *         description: Billing deleted successfully
 */
router
  .route("/:id")
  .get(validateBillingIdParam, getBillingById)
  .put(validateBillingIdParam, updateBilling)
  .delete(validateBillingIdParam, deleteBilling);

export default router;