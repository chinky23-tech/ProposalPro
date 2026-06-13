import {
  createPackageService,
  getPackagesByUserService,
  getPackageByIdService,
  updatePackageService,
  deletePackageService
} from "../services/packages.service.js";
import { validatePackageInput } from "../validations/packages.validation.js";
import { successResponse, createdResponse } from "../utils/response.util.js";
import { handleError } from "../utils/error.util.js";

export const createPackage = async (req, res) => {
  try {
    const validatedData = validatePackageInput(req.body);
    const newPackage = await createPackageService(req.user.id, validatedData);
    return createdResponse(res, newPackage, "Package tier created successfully");
  } catch (error) {
    return handleError(res, error, "CreatePackageController");
  }
};

export const getPackages = async (req, res) => {
  try {
    const packages = await getPackagesByUserService(req.user.id);
    return successResponse(res, packages, "Packages retrieved successfully");
  } catch (error) {
    return handleError(res, error, "GetPackagesController");
  }
};

export const getPackageById = async (req, res) => {
  try {
    const { id } = req.params;
    const pkg = await getPackageByIdService(req.user.id, id);
    return successResponse(res, pkg, "Package details retrieved successfully");
  } catch (error) {
    return handleError(res, error, "GetPackageByIdController");
  }
};

export const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = validatePackageInput(req.body);
    const updatedPackage = await updatePackageService(req.user.id, id, validatedData);
    return successResponse(res, updatedPackage, "Package tier updated successfully");
  } catch (error) {
    return handleError(res, error, "UpdatePackageController");
  }
};

export const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;
    await deletePackageService(req.user.id, id);
    return successResponse(res, null, "Package tier removed successfully");
  } catch (error) {
    return handleError(res, error, "DeletePackageController");
  }
};