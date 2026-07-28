import {
  createBillingService,
  getBillingService,
  getBillingByIdService,
  updateBillingService,
  deleteBillingService,
} from "../services/billing.service.js";

import {
  validateCreateBilling,
  validateUpdateBilling,
} from "../validations/billing.validation.js";

import { handleError } from "../utils/error.util.js";
import { createdResponse } from "../utils/response.util.js";

// ==========================================
// Create Billing
// ==========================================
export const createBilling = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;

    const validated =
      validateCreateBilling(req.body);

    const billing =
      await createBillingService({
        userId,
        ...validated,
      });

    return createdResponse(
      res,
      "Billing record created successfully",
      {
        billing,
      }
    );
  } catch (error) {
    console.error(
      "Create billing error:",
      error?.message || error
    );

    return handleError(res, error);
  }
};

// ==========================================
// Get All Billing
// ==========================================
export const getBilling = async (
  req,
  res
) => {
  try {
    const billing =
      await getBillingService(
        req.user.id
      );

    return res.status(200).json(billing);
  } catch (error) {
    console.error(
      "Get billing error:",
      error?.message || error
    );

    return handleError(res, error);
  }
};

// ==========================================
// Get Billing By ID
// ==========================================
export const getBillingById =
  async (req, res) => {
    try {
      const billing =
        await getBillingByIdService(
          req.params.id,
          req.user.id
        );

      if (!billing) {
        return res.status(404).json({
          message:
            "Billing record not found",
        });
      }

      return res.status(200).json(
        billing
      );
    } catch (error) {
      console.error(
        "Get billing error:",
        error?.message || error
      );

      return handleError(res, error);
    }
  };

// ==========================================
// Update Billing
// ==========================================
export const updateBilling =
  async (req, res) => {
    try {
      const validated =
        validateUpdateBilling(
          req.body
        );

      const billing =
        await updateBillingService({
          billingId:
            req.params.id,

          userId: req.user.id,

          ...validated,
        });

      if (!billing) {
        return res.status(404).json({
          message:
            "Billing record not found",
        });
      }

      return res.status(200).json({
        message:
          "Billing updated successfully",

        billing,
      });
    } catch (error) {
      console.error(
        "Update billing error:",
        error?.message || error
      );

      return handleError(res, error);
    }
  };

// ==========================================
// Delete Billing
// ==========================================
export const deleteBilling =
  async (req, res) => {
    try {
      const billing =
        await deleteBillingService(
          req.params.id,
          req.user.id
        );

      if (!billing) {
        return res.status(404).json({
          message:
            "Billing record not found",
        });
      }

      return res.status(200).json({
        message:
          "Billing deleted successfully",

        billing,
      });
    } catch (error) {
      console.error(
        "Delete billing error:",
        error?.message || error
      );

      return handleError(res, error);
    }
  };