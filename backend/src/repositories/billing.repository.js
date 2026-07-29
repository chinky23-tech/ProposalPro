import pool from "../config/db.js";

// ==========================================
// Create Billing Record
// ==========================================
export const createBilling = async ({
  userId,
  plan,
  amount,
  currency,
  status,
  paymentMethod,
  billingDate,
  nextBillingDate,
}) => {
  const result = await pool.query(
    `
    INSERT INTO billing (
      user_id,
      plan,
      amount,
      currency,
      status,
      payment_method,
      billing_date,
      next_billing_date
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *;
    `,
    [
      userId,
      plan,
      amount,
      currency,
      status,
      paymentMethod,
      billingDate,
      nextBillingDate,
    ]
  );

  return result.rows[0];
};

// ==========================================
// Get All Billing Records
// ==========================================
export const getAllBilling = async (userId) => {
  const result = await pool.query(
    `
    SELECT *
    FROM billing
    WHERE user_id=$1
    ORDER BY created_at DESC;
    `,
    [userId]
  );

  return result.rows;
};

export const getLatestBillingByUserId = async (userId) => {
  const result = await pool.query(
    `
    SELECT *
    FROM billing
    WHERE user_id=$1
    ORDER BY created_at DESC
    LIMIT 1;
    `,
    [userId]
  );

  return result.rows[0] || null;
};

// ==========================================
// Get Billing By Id
// ==========================================
export const getBillingById = async (billingId, userId) => {
  const result = await pool.query(
    `
    SELECT *
    FROM billing
    WHERE id=$1
      AND user_id=$2;
    `,
    [billingId, userId]
  );

  return result.rows[0] || null;
};

// ==========================================
// Update Billing
// ==========================================
export const updateBilling = async ({
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
  const result = await pool.query(
    `
    UPDATE billing
    SET
      plan=$1,
      amount=$2,
      currency=$3,
      status=$4,
      payment_method=$5,
      billing_date=$6,
      next_billing_date=$7
    WHERE
      id=$8
      AND user_id=$9
    RETURNING *;
    `,
    [
      plan,
      amount,
      currency,
      status,
      paymentMethod,
      billingDate,
      nextBillingDate,
      billingId,
      userId,
    ]
  );

  return result.rows[0];
};

// ==========================================
// Delete Billing
// ==========================================
export const deleteBilling = async (billingId, userId) => {
  const result = await pool.query(
    `
    DELETE FROM billing
    WHERE
      id=$1
      AND user_id=$2
    RETURNING *;
    `,
    [billingId, userId]
  );

  return result.rows[0];
};

// ==========================================
// Billing Exists
// ==========================================
export const billingExists = async (billingId, userId) => {
  return await getBillingById(billingId, userId);
};

// ==========================================
// 🟢 STRIPE HELPERS FOR USER & SUBSCRIPTIONS
// ==========================================

export const getUserWithBilling = async (userId) => {
  const result = await pool.query(
    `SELECT id, email, name, stripe_customer_id FROM users WHERE id = $1;`,
    [userId]
  );
  return result.rows[0] || null;
};

export const updateStripeCustomerId = async (userId, stripeCustomerId) => {
  const result = await pool.query(
    `UPDATE users SET stripe_customer_id = $1 WHERE id = $2 RETURNING *;`,
    [stripeCustomerId, userId]
  );
  return result.rows[0];
};

export const updateSubscriptionByStripeId = async (
  stripeSubscriptionId,
  { status, plan, currentPeriodEnd }
) => {
  const result = await pool.query(
    `
    UPDATE billing
    SET status = $1, plan = $2, next_billing_date = $3
    WHERE stripe_subscription_id = $4
    RETURNING *;
    `,
    [status, plan, currentPeriodEnd, stripeSubscriptionId]
  );
  return result.rows[0];
};