import {
  createBilling,
  getAllBilling,
  getBillingById,
  updateBilling,
  deleteBilling,
  billingExists,
} from "../repositories/billing.repository.js";

// ==========================================
// Create Billing
// ==========================================
export const createBillingService = async (
  billingData
) => {
  return await createBilling(billingData);
};

// ==========================================
// Get All Billing
// ==========================================
export const getBillingService = async (
  userId
) => {
  return await getAllBilling(userId);
};

// ==========================================
// Get Billing By ID
// ==========================================
export const getBillingByIdService = async (
  billingId,
  userId
) => {
  return await getBillingById(
    billingId,
    userId
  );
};

// ==========================================
// Update Billing
// ==========================================
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
  const existing =
    await billingExists(
      billingId,
      userId
    );

  if (!existing) {
    return null;
  }

  return await updateBilling({
    billingId,
    userId,

    plan:
      plan ?? existing.plan,

    amount:
      amount ?? existing.amount,

    currency:
      currency ??
      existing.currency,

    status:
      status ??
      existing.status,

    paymentMethod:
      paymentMethod ??
      existing.payment_method,

    billingDate:
      billingDate ??
      existing.billing_date,

    nextBillingDate:
      nextBillingDate ??
      existing.next_billing_date,
  });
};

// ==========================================
// Delete Billing
// ==========================================
export const deleteBillingService =
  async (
    billingId,
    userId
  ) => {
    return await deleteBilling(
      billingId,
      userId
    );
  };