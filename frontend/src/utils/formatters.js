export const formatCurrency = (value) => {
  const amount = Number.parseFloat(value);

  if (Number.isNaN(amount)) {
    return "$0";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};
