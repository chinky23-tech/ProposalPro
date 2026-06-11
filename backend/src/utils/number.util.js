export const parseMonetaryValue = (
  value
) => {
  if (
    value === undefined ||
    value === null
  ) {
    return 0;
  }

  if (typeof value === "number") {
    return value;
  }

  const cleaned = String(value).replace(
    /[^0-9.-]+/g,
    ""
  );

  const parsed = parseFloat(cleaned);

  return Number.isNaN(parsed)
    ? 0
    : parsed;
};