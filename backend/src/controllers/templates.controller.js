import {
  createTemplateService,
  getTemplatesByUserService,
  getTemplateByIdService,
  updateTemplateService,
  deleteTemplateService
} from "../services/templates.service.js";
import { validateTemplateInput } from "../validations/templates.validation.js";
import { successResponse, createdResponse } from "../utils/response.util.js";
import { handleError } from "../utils/error.util.js";

export const createTemplate = async (req, res) => {
  try {
    const validatedData = validateTemplateInput(req.body);
    const newTemplate = await createTemplateService(req.user.id, validatedData);
    return createdResponse(res, newTemplate, "Template document created successfully");
  } catch (error) {
    return handleError(res, error, "CreateTemplateController");
  }
};

export const getTemplates = async (req, res) => {
  try {
    const templates = await getTemplatesByUserService(req.user.id);
    return successResponse(res, templates, "Templates retrieved successfully");
  } catch (error) {
    return handleError(res, error, "GetTemplatesController");
  }
};

export const getTemplateById = async (req, res) => {
  try {
    const { id } = req.params;
    const template = await getTemplateByIdService(req.user.id, id);
    return successResponse(res, template, "Template details retrieved successfully");
  } catch (error) {
    return handleError(res, error, "GetTemplateByIdController");
  }
};

export const updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = validateTemplateInput(req.body);
    const updatedTemplate = await updateTemplateService(req.user.id, id, validatedData);
    return successResponse(res, updatedTemplate, "Template details updated successfully");
  } catch (error) {
    return handleError(res, error, "UpdateTemplateController");
  }
};

export const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteTemplateService(req.user.id, id);
    return successResponse(res, null, "Template document successfully removed");
  } catch (error) {
    return handleError(res, error, "DeleteTemplateController");
  }
};