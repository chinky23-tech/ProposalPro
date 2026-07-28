// ==========================================
// Create Billing Validation
// ==========================================
export const validateCreateBilling = ({
  plan,
  amount,
  currency,
  status,
  paymentMethod,
  billingDate,
  nextBillingDate,
}) => {
  if (!plan || !plan.trim()) {
    throw new Error("Plan is required");
  }

  if (amount === undefined || amount === null || amount === "") {
    throw new Error("Amount is required");
  }

  const parsedAmount = Number(amount);

  if (Number.isNaN(parsedAmount) || parsedAmount < 0) {
    throw new Error("Amount must be a valid positive number");
  }

  return {
    plan: plan.trim(),
    amount: parsedAmount,
    currency: currency?.trim() || "USD",
    status: status?.trim() || "Pending",
    paymentMethod: paymentMethod?.trim() || null,
    billingDate: billingDate || null,
    nextBillingDate: nextBillingDate || null,
  };
};

// ==========================================
// Update Billing Validation
// ==========================================
export const validateUpdateBilling = ({
  plan,
  amount,
  currency,
  status,
  paymentMethod,
  billingDate,
  nextBillingDate,
}) => {
  let parsedAmount = undefined;

  if (
    plan !== undefined &&
    (!plan || !plan.trim())
  ) {
    throw new Error("Plan cannot be empty");
  }

  if (amount !== undefined) {
    parsedAmount = Number(amount);

    if (
      Number.isNaN(parsedAmount) ||
      parsedAmount < 0
    ) {
      throw new Error(
        "Amount must be a valid positive number"
      );
    }
  }

  return {
    plan:
      plan !== undefined
        ? plan.trim()
        : undefined,

    amount: parsedAmount,

    currency:
      currency !== undefined
        ? currency.trim()
        : undefined,

    status:
      status !== undefined
        ? status.trim()
        : undefined,

    paymentMethod:
      paymentMethod !== undefined
        ? paymentMethod.trim()
        : undefined,

    billingDate:
      billingDate !== undefined
        ? billingDate
        : undefined,

    nextBillingDate:
      nextBillingDate !== undefined
        ? nextBillingDate
        : undefined,
  };
};

// ==========================================
// Validate Billing ID
// ==========================================
export const validateBillingIdParam = (
  req,
  res,
  next
) => {
  const { id } = req.params;

  const regex = /^[a-zA-Z0-9-]+$/;

  if (!id || !regex.test(id)) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid billing identifier.",
    });
  }

  next();
};