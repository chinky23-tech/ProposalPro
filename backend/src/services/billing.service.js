/*import Stripe from "stripe";
import {
  createBilling,
  getAllBilling,
  getBillingById,
  updateBilling,
  deleteBilling,
  billingExists,
  getLatestBillingByUserId,
  getUserWithBilling,
  updateStripeCustomerId,
  updateSubscriptionByStripeId,
} from "../repositories/billing.repository.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ==========================================
// Stripe Checkout Session Service
// ==========================================
export const createCheckoutSessionService = async (
  userId,
  { priceId, successUrl, cancelUrl }
) => {
  const user = await getUserWithBilling(userId);
  if (!user) {
    throw new Error("User not found");
  }

  let customerId = user.stripe_customer_id;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: { userId: userId.toString() },
    });
    customerId = customer.id;
    await updateStripeCustomerId(userId, customerId);
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl || `${process.env.FRONTEND_URL || "http://localhost:3000"}/billing?status=success`,
    cancel_url: cancelUrl || `${process.env.FRONTEND_URL || "http://localhost:3000"}/billing?status=cancelled`,
    metadata: { userId: userId.toString() },
  });

  return { checkoutUrl: session.url, sessionId: session.id };
};

// ==========================================
// Stripe Customer Portal Service
// ==========================================
export const createCustomerPortalService = async (userId, returnUrl) => {
  const user = await getUserWithBilling(userId);
  if (!user?.stripe_customer_id) {
    throw new Error("No active billing account found for this user");
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripe_customer_id,
    return_url: returnUrl || `${process.env.FRONTEND_URL || "http://localhost:3000"}/billing`,
  });

  return { portalUrl: portalSession.url };
};

// ==========================================
// Stripe Webhook Event Handler Service
// ==========================================
export const handleStripeWebhookService = async (rawBody, signature) => {
  const event = stripe.webhooks.constructEvent(
    rawBody,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.metadata.userId;
      const stripeSubscriptionId = session.subscription;

      const subscriptionDetails = await stripe.subscriptions.retrieve(
        stripeSubscriptionId
      );

      await createBilling({
        userId,
        plan: "PRO",
        amount: (session.amount_total || 2900) / 100,
        currency: session.currency?.toUpperCase() || "USD",
        status: "Paid",
        paymentMethod: "Stripe",
        billingDate: new Date(),
        nextBillingDate: new Date(subscriptionDetails.current_period_end * 1000),
      });
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object;

      await updateSubscriptionByStripeId(subscription.id, {
        status: subscription.status === "active" ? "Paid" : "Cancelled",
        plan: subscription.status === "active" ? "PRO" : "FREE",
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      });
      break;
    }

    default:
      break;
  }
};

// ==========================================
// Get Subscription Status Service
// ==========================================
export const getSubscriptionStatusService = async (userId) => {
  const latestBilling = await getLatestBillingByUserId(userId);

  const plan = latestBilling?.plan
    ? latestBilling.plan.toUpperCase().includes("PRO")
      ? "PRO"
      : latestBilling.plan.toUpperCase().includes("ENTERPRISE")
      ? "ENTERPRISE"
      : "PRO"
    : "FREE";

  const status = latestBilling?.status || "Active";
  const stripeSubscriptionId =
    latestBilling?.payment_method === "Stripe" ? latestBilling.id : null;
  const aiProposalLimit = plan === "PRO" ? 100 : 3;
  const aiProposalsUsed = 0;

  return {
    plan,
    status,
    stripeSubscriptionId,
    aiProposalLimit,
    aiProposalsUsed,
    billing: latestBilling,
  };
};

// ==========================================
// Base CRUD Services (Fixes Missing Exports)
// ==========================================
export const createBillingService = async (billingData) => {
  return await createBilling(billingData);
};

export const getBillingService = async (userId) => {
  return await getAllBilling(userId);
};

export const getBillingByIdService = async (billingId, userId) => {
  return await getBillingById(billingId, userId);
};

export const updateBillingService = async ({
  billingId,
  userId,
  plan,
  amount,
  currency,
  status,
  paymentMethod,
  billingDate,
  nextBillingDate,
}) => {
  const existing = await billingExists(billingId, userId);

  if (!existing) {
    return null;
  }

  return await updateBilling({
    billingId,
    userId,
    plan: plan ?? existing.plan,
    amount: amount ?? existing.amount,
    currency: currency ?? existing.currency,
    status: status ?? existing.status,
    paymentMethod: paymentMethod ?? existing.payment_method,
    billingDate: billingDate ?? existing.billing_date,
    nextBillingDate: nextBillingDate ?? existing.next_billing_date,
  });
};

export const deleteBillingService = async (billingId, userId) => {
  return await deleteBilling(billingId, userId);
};*/

import Stripe from "stripe";
import {
  createBilling,
  getAllBilling,
  getBillingById,
  updateBilling,
  deleteBilling,
  billingExists,
  getLatestBillingByUserId,
  getUserWithBilling,
  updateStripeCustomerId,
  updateSubscriptionByStripeId,
} from "../repositories/billing.repository.js";
import db from "../config/db.js"; // Import database instance for direct updates

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ==========================================
// Stripe Checkout Session Service
// ==========================================
export const createCheckoutSessionService = async (
  userId,
  { priceId, successUrl, cancelUrl }
) => {
  const user = await getUserWithBilling(userId);
  if (!user) {
    throw new Error("User not found");
  }

  let customerId = user.stripe_customer_id;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: { userId: userId.toString() },
    });
    customerId = customer.id;
    await updateStripeCustomerId(userId, customerId);
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl || `${process.env.FRONTEND_URL || "http://localhost:5173"}/dashboard/billing?success=true`,
    cancel_url: cancelUrl || `${process.env.FRONTEND_URL || "http://localhost:5173"}/dashboard/billing?canceled=true`,
    metadata: { userId: userId.toString() },
    client_reference_id: userId.toString(),
  });

  return { checkoutUrl: session.url, sessionId: session.id };
};

// ==========================================
// Stripe Customer Portal Service
// ==========================================
export const createCustomerPortalService = async (userId, returnUrl) => {
  const user = await getUserWithBilling(userId);
  if (!user?.stripe_customer_id) {
    throw new Error("No active billing account found for this user");
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripe_customer_id,
    return_url: returnUrl || `${process.env.FRONTEND_URL || "http://localhost:5173"}/dashboard/billing`,
  });

  return { portalUrl: portalSession.url };
};

// ==========================================
// Stripe Webhook Event Handler Service
// ==========================================
export const handleStripeWebhookService = async (rawBody, signature) => {
  const event = stripe.webhooks.constructEvent(
    rawBody,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.metadata?.userId || session.client_reference_id;
      const stripeSubscriptionId = session.subscription;

      if (!userId) break;

      let currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 day default fallback

      if (stripeSubscriptionId) {
        const subscriptionDetails = await stripe.subscriptions.retrieve(
          stripeSubscriptionId
        );
        currentPeriodEnd = new Date(subscriptionDetails.current_period_end * 1000);
      }

      // 1. Update users table billing_tier & status
      await db.query(
        `UPDATE users 
         SET billing_tier = 'PRO', 
             billing_status = 'Active', 
             stripe_customer_id = $1 
         WHERE id = $2`,
        [session.customer, userId]
      );

      // 2. Insert record into billing table
      await createBilling({
        userId,
        plan: "PRO",
        amount: (session.amount_total || 2900) / 100,
        currency: session.currency?.toUpperCase() || "USD",
        status: "Active",
        paymentMethod: "Stripe",
        stripeSubscriptionId,
        billingDate: new Date(),
        nextBillingDate: currentPeriodEnd,
      });
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const isActive = subscription.status === "active";
      const targetPlan = isActive ? "PRO" : "FREE";
      const targetStatus = isActive ? "Active" : "Cancelled";

      // Update billing record
      await updateSubscriptionByStripeId(subscription.id, {
        status: targetStatus,
        plan: targetPlan,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      });

      // Update user table tier
      await db.query(
        `UPDATE users 
         SET billing_tier = $1, billing_status = $2 
         WHERE stripe_customer_id = $3`,
        [targetPlan, targetStatus, subscription.customer]
      );
      break;
    }

    default:
      break;
  }
};

// ==========================================
// Get Subscription Status Service
// ==========================================
export const getSubscriptionStatusService = async (userId) => {
  const user = await getUserWithBilling(userId);
  const latestBilling = await getLatestBillingByUserId(userId);

  // Check users table first, then billing table as fallback
  const rawPlan = (user?.billing_tier || latestBilling?.plan || "FREE").toUpperCase();
  const plan = rawPlan.includes("PRO") ? "PRO" : rawPlan.includes("ENTERPRISE") ? "ENTERPRISE" : "FREE";

  const status = user?.billing_status || latestBilling?.status || "Active";
  const stripeSubscriptionId = latestBilling?.stripe_subscription_id || user?.stripe_subscription_id || null;
  const aiProposalLimit = plan === "PRO" ? 100 : plan === "ENTERPRISE" ? 500 : 3;
  const aiProposalsUsed = user?.ai_proposals_used || 0;

  return {
    plan,
    status,
    stripeSubscriptionId,
    aiProposalLimit,
    aiProposalsUsed,
    billing: latestBilling || null,
  };
};

// ==========================================
// Base CRUD Services
// ==========================================
export const createBillingService = async (billingData) => {
  return await createBilling(billingData);
};

export const getBillingService = async (userId) => {
  return await getAllBilling(userId);
};

export const getBillingByIdService = async (billingId, userId) => {
  return await getBillingById(billingId, userId);
};

export const updateBillingService = async ({
  billingId,
  userId,
  plan,
  amount,
  currency,
  status,
  paymentMethod,
  billingDate,
  nextBillingDate,
}) => {
  const existing = await billingExists(billingId, userId);

  if (!existing) {
    return null;
  }

  return await updateBilling({
    billingId,
    userId,
    plan: plan ?? existing.plan,
    amount: amount ?? existing.amount,
    currency: currency ?? existing.currency,
    status: status ?? existing.status,
    paymentMethod: paymentMethod ?? existing.payment_method,
    billingDate: billingDate ?? existing.billing_date,
    nextBillingDate: nextBillingDate ?? existing.next_billing_date,
  });
};

export const deleteBillingService = async (billingId, userId) => {
  return await deleteBilling(billingId, userId);
};