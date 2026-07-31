import {
  createBillingService,
  getBillingService,
  getBillingByIdService,
  updateBillingService,
  deleteBillingService,
  getSubscriptionStatusService,
  createCheckoutSessionService,
  createCustomerPortalService,
  handleStripeWebhookService,
} from "../services/billing.service.js";

import {
  validateCreateBilling,
  validateUpdateBilling,
  validateCheckoutInput,
} from "../validations/billing.validation.js";

import { handleError } from "../utils/error.util.js";
import { createdResponse } from "../utils/response.util.js";

// ==========================================
// Stripe Checkout Session
// ==========================================
export const createCheckoutSession = async (req, res) => {
  try {
    const validatedData = validateCheckoutInput(req.body);
    const session = await createCheckoutSessionService(req.user.id, validatedData);

    return res.status(200).json({
      success: true,
      message: "Checkout session initialized successfully",
      data: session,
    });
  } catch (error) {
    console.error("Create checkout session error:", error?.message || error);
    return handleError(res, error);
  }
};

// ==========================================
// Stripe Customer Portal
// ==========================================
export const createCustomerPortal = async (req, res) => {
  try {
    const { returnUrl } = req.body;
    const portal = await createCustomerPortalService(req.user.id, returnUrl);

    return res.status(200).json({
      success: true,
      message: "Customer portal link generated successfully",
      data: portal,
    });
  } catch (error) {
    console.error("Create customer portal error:", error?.message || error);
    return handleError(res, error);
  }
};

// ==========================================
// Stripe Webhook Listener
// ==========================================
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  try {
    await handleStripeWebhookService(req.body, sig);
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error?.message || error);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
};

// ==========================================
// Get Subscription Status
// ==========================================
export const getSubscriptionStatus = async (req, res) => {
  try {
    const subscription = await getSubscriptionStatusService(req.user.id);
    return res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    console.error("Get subscription status error:", error?.message || error);
    return handleError(res, error);
  }
};

// ==========================================
// Standard Billing CRUD Controllers
// ==========================================
export const createBilling = async (req, res) => {
  try {
    const userId = req.user.id;
    const validated = validateCreateBilling(req.body);
    const billing = await createBillingService({ userId, ...validated });

    return createdResponse(res, "Billing record created successfully", { billing });
  } catch (error) {
    console.error("Create billing error:", error?.message || error);
    return handleError(res, error);
  }
};

export const getBilling = async (req, res) => {
  try {
    const billing = await getBillingService(req.user.id);
    return res.status(200).json(billing);
  } catch (error) {
    console.error("Get billing error:", error?.message || error);
    return handleError(res, error);
  }
};

export const getBillingById = async (req, res) => {
  try {
    const billing = await getBillingByIdService(req.params.id, req.user.id);

    if (!billing) {
      return res.status(404).json({ message: "Billing record not found" });
    }

    return res.status(200).json(billing);
  } catch (error) {
    console.error("Get billing error:", error?.message || error);
    return handleError(res, error);
  }
};

export const updateBilling = async (req, res) => {
  try {
    const validated = validateUpdateBilling(req.body);
    const billing = await updateBillingService({
      billingId: req.params.id,
      userId: req.user.id,
      ...validated,
    });

    if (!billing) {
      return res.status(404).json({ message: "Billing record not found" });
    }

    return res.status(200).json({
      message: "Billing updated successfully",
      billing,
    });
  } catch (error) {
    console.error("Update billing error:", error?.message || error);
    return handleError(res, error);
  }
};

export const deleteBilling = async (req, res) => {
  try {
    const billing = await deleteBillingService(req.params.id, req.user.id);

    if (!billing) {
      return res.status(404).json({ message: "Billing record not found" });
    }

    return res.status(200).json({
      message: "Billing deleted successfully",
      billing,
    });
  } catch (error) {
    console.error("Delete billing error:", error?.message || error);
    return handleError(res, error);
  }
};