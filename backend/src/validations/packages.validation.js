export const validatePackageInput = (data) => {
  const { name, description, price, features, billing_type } = data;

  if (!name || name.trim() === "") {
    throw new Error("Package name is required");
  }

  if (price === undefined || price === null || isNaN(price) || Number(price) < 0) {
    throw new Error("A valid positive package price is required");
  }

  const normalizedBillingType = typeof billing_type === "string"
    ? billing_type.trim().toLowerCase().replace(/\s+/g, "_")
    : "";

  const allowedBillingTypes = ["monthly", "yearly", "one_time", "one-time", "hourly", "annually"];

  if (!normalizedBillingType || !allowedBillingTypes.includes(normalizedBillingType)) {
    throw new Error("A valid billing type is required");
  }

  return {
    name: name.trim(),
    description: description ? description.trim() : null,
    price: Number(price),
    billing_type: normalizedBillingType === "one-time" ? "one_time" : normalizedBillingType,
    // Ensure features is always an array of cleaned strings if provided
    features: Array.isArray(features) ? features.map(f => f.trim()) : []
  };
};