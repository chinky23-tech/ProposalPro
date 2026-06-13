import {
  insertPackage,
  selectPackagesByUserId,
  selectPackageById,
  updatePackageById,
  deletePackageById
} from "../repositories/packages.repository.js";

export const createPackageService = async (userId, packageData) => {
  return await insertPackage({ user_id: userId, ...packageData });
};

export const getPackagesByUserService = async (userId) => {
  return await selectPackagesByUserId(userId);
};

export const getPackageByIdService = async (userId, packageId) => {
  const pkg = await selectPackageById(packageId);

  if (!pkg) {
    const error = new Error("Package not found");
    error.statusCode = 404;
    throw error;
  }

  if (pkg.user_id !== userId) {
    const error = new Error("Forbidden: You do not own this service package");
    error.statusCode = 403;
    throw error;
  }

  return pkg;
};

export const updatePackageService = async (userId, packageId, packageData) => {
  await getPackageByIdService(userId, packageId);
  return await updatePackageById(packageId, packageData);
};

export const deletePackageService = async (userId, packageId) => {
  await getPackageByIdService(userId, packageId);
  return await deletePackageById(packageId);
};