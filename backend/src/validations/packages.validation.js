export const validatePackageInput = (data) => {
  const { name, description, price, features } = data;

  if (!name || name.trim() === "") {
    throw new Error("Package name is required");
  }

  if (price === undefined || price === null || isNaN(price) || Number(price) < 0) {
    throw new Error("A valid positive package price is required");
  }

  return {
    name: name.trim(),
    description: description ? description.trim() : null,
    price: Number(price),
    // Ensure features is always an array of cleaned strings if provided
    features: Array.isArray(features) ? features.map(f => f.trim()) : []
  };
};