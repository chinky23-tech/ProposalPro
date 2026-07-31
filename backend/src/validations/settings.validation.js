// Helper for email regex
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Helper for Hex Color regex (#10b981)
const isValidHexColor = (color) => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

// Helper for URL validation
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};

// ==========================================
// 1. Profile Validation
// ==========================================
export const validateUpdateProfile = (data) => {
  const { name, title, bio } = data;

  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length < 2) {
      throw new Error("Name must be at least 2 characters long");
    }
  }

  if (title !== undefined && title !== null) {
    if (typeof title !== "string" || title.length > 100) {
      throw new Error("Professional title cannot exceed 100 characters");
    }
  }

  if (bio !== undefined && bio !== null) {
    if (typeof bio !== "string" || bio.length > 500) {
      throw new Error("Bio cannot exceed 500 characters");
    }
  }

  return {
    name: name?.trim(),
    title: title?.trim() || null,
    bio: bio?.trim() || null,
  };
};

// ==========================================
// 2. Workspace Validation
// ==========================================
export const validateUpdateWorkspace = (data) => {
  const { companyName, website, brandColor, defaultCurrency, taxRate } = data;

  if (!companyName || typeof companyName !== "string" || !companyName.trim()) {
    throw new Error("Company name is required");
  }

  if (website && !isValidUrl(website)) {
    throw new Error("Website must be a valid URL (e.g., https://example.com)");
  }

  if (brandColor && !isValidHexColor(brandColor)) {
    throw new Error("Brand color must be a valid HEX color code (e.g., #10b981)");
  }

  const validCurrencies = ["USD", "EUR", "GBP", "INR", "CAD", "AUD"];
  if (defaultCurrency && !validCurrencies.includes(defaultCurrency.toUpperCase())) {
    throw new Error(`Currency must be one of: ${validCurrencies.join(", ")}`);
  }

  if (taxRate !== undefined) {
    const numTax = Number(taxRate);
    if (isNaN(numTax) || numTax < 0 || numTax > 100) {
      throw new Error("Tax rate must be a number between 0 and 100");
    }
  }

  return {
    companyName: companyName.trim(),
    website: website?.trim() || null,
    brandColor: brandColor || "#10b981",
    defaultCurrency: defaultCurrency ? defaultCurrency.toUpperCase() : "USD",
    taxRate: taxRate !== undefined ? Number(taxRate) : 0.0,
  };
};

// ==========================================
// 3. Notification Validation
// ==========================================
export const validateUpdateNotifications = (data) => {
  const {
    emailProposalOpened,
    emailProposalAccepted,
    emailPaymentReceived,
    emailWeeklyDigest,
    inAppAlerts,
  } = data;

  return {
    emailProposalOpened: Boolean(emailProposalOpened ?? true),
    emailProposalAccepted: Boolean(emailProposalAccepted ?? true),
    emailPaymentReceived: Boolean(emailPaymentReceived ?? true),
    emailWeeklyDigest: Boolean(emailWeeklyDigest ?? false),
    inAppAlerts: Boolean(inAppAlerts ?? true),
  };
};

// ==========================================
// 4. Security / Password Validation
// ==========================================
export const validateUpdatePassword = (data) => {
  const { currentPassword, newPassword, confirmPassword } = data;

  if (!currentPassword) {
    throw new Error("Current password is required");
  }

  if (!newPassword || newPassword.length < 8) {
    throw new Error("New password must be at least 8 characters long");
  }

  if (newPassword !== confirmPassword) {
    throw new Error("Confirm password does not match new password");
  }

  return {
    currentPassword,
    newPassword,
  };
};