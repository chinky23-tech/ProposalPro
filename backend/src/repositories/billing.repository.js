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

// ==========================================
// Get Billing By Id
// ==========================================
export const getBillingById = async (
  billingId,
  userId
) => {
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
export const deleteBilling = async (
  billingId,
  userId
) => {
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
export const billingExists = async (
  billingId,
  userId
) => {
  return await getBillingById(
    billingId,
    userId
  );
};